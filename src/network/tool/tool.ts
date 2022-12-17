import lzRequest from "../request";
import {IDataType} from "../type";

export function addToolType(type: string) {
  return lzRequest.post<IDataType>({
    url: `/toolSite/type`,
    data: {
      type,
    },
  });
}

export function getTypeList() {
  return lzRequest.get({
    url: `/toolSite/type`,
  });
}

export function addToolSite(name:string, url:string, iconUrl:string, type:any) {
  return lzRequest.post<IDataType>({
    url: `/toolSite`,
    data: {
      name,
      url,
      iconUrl,
      type,
    },
  });
}


export function getToolList(){
  return lzRequest.get({
    url: `/toolSite`,
  });
}


export function deleteTool(id:number){
  return lzRequest.delete({
    url: `/toolSite/${id}`,
  })
}

export function deleteType(id:number){
  return lzRequest.delete({
    url: `/toolSite/type/${id}`,
  })
}