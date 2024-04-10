import React, { useEffect, useState } from "react";
import { ListAPI } from "../api/Board.api";

interface ListType {
  readonly id: string;
  readonly identifier_id: string;
  readonly category: string;
  readonly content: string;
  readonly title: string;
  readonly nickname: string;
  readonly created_at: Date;
  readonly updated_at: Date;
  readonly deleted_at: Date | null;
}
const BoardList = () => {
  const [list, setList] = useState<ListType[]>([]);

  useEffect(() => {
    ListAPI({ take: 10, lastId: null, category: null })
      .then((res) => {
        const response = res.data.response.current_list;
        console.log("response : ", response);

        setList(response);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => console.log("list : ", list), [list]);
  return <>List</>;
};

export default BoardList;
