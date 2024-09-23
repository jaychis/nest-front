import { client } from "./Client";

export const getShareCount = async(id: string) => {
    try{
        const res = await client.get(`boards/${id}/share-count`)
        console.log(res)
    }
    catch(err){
        console.error(err)
    }
}