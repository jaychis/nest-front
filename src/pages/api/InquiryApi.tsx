import { client } from "./Client";

export interface InquiryParam{
    title : string;
    nickName : string;
    content : string;
}

interface ListParams {
    readonly take: number;
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

export const getContactAllListAPi = ({take,lastId}:ListParams) => {
    try{
        let URL: string = `boards/list/all?take=${take}`;
        if(lastId) URL += `&lastId=${lastId}`;

        const res = client.get(URL);
        return res;
    }
    catch(err){}
}