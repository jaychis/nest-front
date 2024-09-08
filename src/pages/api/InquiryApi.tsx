import { client } from "./Client";

export interface InquiryParam{
    title : string;
    nickName : string;
    content : string;
}

interface ListParams {
    readonly take: number;
    readonly page: number;
    readonly lastId?: string | null;
    readonly category?: string | null;
  } 

export const postContactApi = ({title, nickName, content} : InquiryParam) => {
    try{
        const req = client.post('contact/us',
            {title : title,
            nickname : nickName,
            content : content}
        )
        console.log(req)
        return req
    }
    catch(err){console.error(err)}
}

export const getContactAllListAPi = async ({take,page,lastId}:ListParams) => {
    
    try{
        let URL: string = `contact/us/list?page=${page}&take=${take}`;
        if(lastId) URL += `&lastId=${lastId}`;

        const res = await client.get(URL);
        return res;
    }
    catch(err){ console.error(err)}
}