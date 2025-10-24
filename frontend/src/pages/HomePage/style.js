import styled from 'styled-components';
import { Button } from 'antd';

export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    height: 44px;
`

export const WrapperButtonMore = styled(Button)`
    border: 1px solid rgb(11,116,229);
    color: rgb(11,116,229);
    width: 400px;
    height: 38px;
    border-radius: 4px;
    
   
    &:hover {
        color: #fff; 
        background-color: rgb(13,92,182); 
       
    }
`
export const WrapperProducts = styled.div`
    display: flex;
    gap : 14px;
    margin-top: 20px;
    flex-wrap: wrap;
`