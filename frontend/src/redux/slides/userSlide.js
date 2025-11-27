
import { createSlice, isPending } from '@reduxjs/toolkit'

const initialState = {
  name: '',
  email: '',
  phone: '',
  address: '',
  avatar: '',
  access_token: '',
  id: '',
  isAdmin: false,
  loyaltyDiscountEligible: false,
  orderCount: 0
}

export const userSlide = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUser: (state, action) => {
      const {
        name = '',
        email = '',
        access_token = '',
        phone = '',
        address = '',
        avatar = '',
        _id = '',
        isAdmin,
        loyaltyDiscountEligible = false,
        orderCount = 0
      } = action.payload;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.id = _id;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.loyaltyDiscountEligible = loyaltyDiscountEligible;
      state.orderCount = orderCount;
    },
    updateAccessToken: (state, action) => {
      state.access_token = action.payload;
    },
    resetUser: (state) => {
      state.name = '';
      state.email = '';
      state.phone = '';
      state.address = '';
      state.avatar = '';
      state.id = '';
      state.access_token = '';
      state.isAdmin = false;
      state.loyaltyDiscountEligible = false;
      state.orderCount = 0;
    },
  },
})

// Action creators are generated for each case reducer function
export const { updateUser, updateAccessToken, resetUser } = userSlide.actions

export default userSlide.reducer