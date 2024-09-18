import { access } from "fs";
import { client } from "./Client";
import axios from 'axios'

export interface InquiryParam{
    title : string;
    nickname : string;
    content : string;
}

interface ListParams {
    readonly take: number;
    readonly page: number;
    readonly nickname: string;
    readonly lastId?: string | null;
    readonly category?: string | null;
  } 

export const postContactApi = ({title, nickname, content} : InquiryParam) => {
    const accessToken:string = localStorage.getItem('access_token') as string
    try{
        const req = client.post('contact/us',
            {title : title,
            nickname : nickname,
            content : content},
            {
            headers : {
                Authorization: `Bearer ${accessToken}`
            }
        }
        )
        console.log(req)
        return req
    }
    catch(err){console.error(err)}
}

export const getContactAllListAPi = async ({take,page,lastId, nickname}:ListParams) => {
    const accessToken:string = localStorage.getItem('access_token') as string
    try{
        let URL: string = `contact/us/list?page=${page}&take=${take}&nickname=${nickname}`;
        if(lastId) URL += `&lastId=${lastId}`;

        const res = await client.get(URL,{
            headers : {
                Authorization: `Bearer ${accessToken}`
            }})
        return res;
    }
    catch(err){ console.error(err)}
}

