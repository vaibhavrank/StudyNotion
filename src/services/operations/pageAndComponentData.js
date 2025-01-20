import React from 'react'
import toast from 'react-hot-toast';
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

export const getCatalogPageData = async (categoryId) => {
  const tostId = toast.loading("Loading...");
    let result = [];
  try{
    const response = await apiConnector("POST",catalogData.CATALOGPAGEDATA_API,
    {catagoryId:categoryId,});
    console.log("GET CATALOGPAGE DATA..........",response);
    if(!response?.data?.success){
        throw new Error("Could not fetch category Page Data");
    }
    result = response?.data?.data

  }catch(error){
    console.log("CATALOG PAGE API ERROR ........",error);
    toast.error(error.message)
    result = error?.response?.data
  }
  toast.dismiss(tostId);
  return result;
}

