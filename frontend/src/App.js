
import React, { Fragment, use, useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { routes } from './routes'
import DefaultComponent from './components/DefaultComponent/DefaultComponent'
import { isJsonString } from './utils'
import { jwtDecode } from 'jwt-decode'
import * as UserService from './service/UserService'
import {useDispatch, useSelector} from 'react-redux'
import { updateUser } from './redux/slides/userSlide'
import axios from 'axios'
import Loading from './components/LoadingComponent/Loading'




function App() {
    const dispatch = useDispatch();
    const [isLoadingUser, setIsLoadingUser] = React.useState(true);
    const user = useSelector((state) => state.user);

    const handleGetDetailsUser = async (id, token) => {
        setIsLoadingUser(true);
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
        setIsLoadingUser(false);
    }
    // Tự động refresh token khi load lại trang
    useEffect(() => {
      const {storageData, decoded} = handleDecoded();
      const currentTime = new Date().getTime() / 1000;
      if (storageData && decoded?.exp && decoded.exp < currentTime) {
        // Token hết hạn, gọi refresh
        UserService.refreshToken().then((data) => {
          if (data?.access_token) {
            localStorage.setItem('access_token', JSON.stringify(data.access_token));
            const newDecoded = jwtDecode(data.access_token);
            // Cập nhật Redux user với access_token mới
            if (newDecoded?.id) {
              dispatch(updateUser({ ...newDecoded, access_token: data.access_token }));
              handleGetDetailsUser(newDecoded.id, data.access_token);
            } else {
              setIsLoadingUser(false);
            }
          } else {
            localStorage.removeItem('access_token');
            window.location.href = '/sign-in';
            setIsLoadingUser(false);
          }
        });
      } else if (decoded?.id) {
        handleGetDetailsUser(decoded.id, storageData);
      } else {
        setIsLoadingUser(false);
      }
    }, []);

    const handleDecoded =() => {
      let storageData = localStorage.getItem('access_token');
      let decoded ={}
      if (storageData && isJsonString(storageData)) {
        storageData = JSON.parse(storageData)
        decoded = jwtDecode(storageData)
      }
      return {decoded, storageData}
    }

    UserService.axiosJWT.interceptors.request.use(async (config) => {
      const currentTime = new Date();
      const {decoded} = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken();
        config.headers['Authorization'] = `Bearer ${data?.access_token}`;
        // Cập nhật lại access_token vào localStorage nếu cần
        if (data?.access_token) {
          localStorage.setItem('access_token', JSON.stringify(data.access_token));
        }
      }
      return config;
    }, (err) => {
      return Promise.reject(err);
    });

  

  return (
    <div>
      {isLoadingUser ? (
        <Loading isLoading={true}>
        </Loading>
      ) : (
        <Router>
          <Routes>
            {routes.map((route) => {
              const ischeckAuth = !route.isPrivate || user.isAdmin;
              if (typeof route.path !== 'string' || !ischeckAuth) return null;
              const Page = route.page;
              const Layout = route.isShowHeader ? DefaultComponent : Fragment;
              return (
                <Route key={route.path} path={route.path} element={
                  <Layout>
                    <Page />
                  </Layout>
                } />
              );
            })}
          </Routes>
        </Router>
      )}
    </div>
  )
}

export default App