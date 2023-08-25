"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Board from "../../types/board";
import WriteBoard from "../../components/board/WriteBoard";
import SendData from "../api/board/SendData";
import Page from "./[pagenum]/pagenum";
import FindingMethod from "../../components/board/FindingMethod";
import './../../public/css/board.css';
import { GlassIcon, SortIcon, XMark } from "./../../components/icons";



const defaultBoard: Board = {
  bid: 0,
  nickName: " ",
  btitle: " ",
  bcontent: " ",
  b_createdAt: " ",
  b_updatedAt: "",
  b_views: 0,
  comments: 0,
  b_recommendations: 0,
  commentList:[]
};

const findingMethods = [
  {id: 1,name: 'nickname'},
  {id: 2,name: 'title',},
  {id: 3,name: 'content',},
  {id: 4,name: 'mine',}
]

  const sortMethods=[
    {id:1,name:'recommend'},
    {id:2,name:'newest'},
    {id:3,name:'oldest'}
  ]


//==================================================


function Logined(props: any): any {

  const { data: session } = useSession();
  const [boards, setBoards] = useState<Board[] | any>([]); //board목록
  const [AddFormClass, setAddFormClass] = useState<string | null>(null); //글추가폼의 class
  const [showAddForm, setShowAddForm] = useState<boolean>(false); //글추가폼 켜고끄기
  const [showSearchForm, setSearchForm] = useState<boolean>(false); //검색창 켜고끄기
  const [showSortForm, setSortForm] = useState<boolean>(false); //정렬창 켜고끄기
  const [findStr, setFindStr] = useState<string>('all');
  const [findingMethod, setFindingMethod] = useState<string>('')
  const [inputFindingMethod, setInputFindingMethod] = useState<string>('');
  const [inputFindStr, setInputFindStr] = useState<string>('');

  const [newBoard, CreateNewBoard] = useState<Board>({ ...defaultBoard }); //새로운 board
  const [pages, setPages] = useState<number>(0)

  useEffect(() => {
    console.log("findingMethod:", findingMethod);
    console.log("findStr:", findStr);
  }, [findingMethod, findStr]);

  const fetchData = useCallback(async () => {
    try {
        const response = await SendData("GET", `/boards/page/0`, null, "fetch boards");
        setBoards(response);
    } catch (error) {
        console.error("Error fetching boards:", error);
    }
    }, []);

  function ToggleAddForm(): any {
    if (AddFormClass === "formOn") {
      setAddFormClass("formOff");
      setTimeout(()=>{setShowAddForm(false)}, 290);

    } else if (AddFormClass === "formOff") {
      setShowAddForm(true);
      setAddFormClass("formOn");
      CreateNewBoard(newBoard);
    } else {
      setShowAddForm(true);
      setAddFormClass("formOn");
    }
  }
  function handleAddXButton() {
    setAddFormClass("formOff");
    setTimeout(()=>{setShowAddForm(false)}, 283);
  }
  function handleSearchForm(){
    setSearchForm(!showSearchForm)
  }
  function handleSortForm(){
    setSortForm(!showSortForm)
  }
  function initiallizeSearchParams(){
    setFindStr("");
    setFindingMethod("all");
    setInputFindStr("");
    setInputFindingMethod("");
  }
  async function CreateBoard(newBoard: Board) {
    newBoard.nickName = `${session ? session.user?.name : null}`;
    await SendData("POST", `/boards`,newBoard,"create");
    ToggleAddForm();
    initiallizeSearchParams();
    fetchData();
  }


  if (session) {
    const userName = session.user?.name;

    return (
      <>

      <div className="font-sans items-center max-w-6xl mx-auto flex-col justify-center min-h-screen">
      <br /><br />
        <div className="flex justify-center items-center">
          <h1 className="text-3xl font-bold mb-4 items-center" onClick={() => setPages(0)}></h1></div>

          <br></br>
        

          {/* 검색 */}
          <div className="flex justify-items-end py-2">
            <button onClick={handleSearchForm} className={showSearchForm ? "search active" : "search object-right"}><GlassIcon /></button>
            
            <div className={`search-form 
                            ${showSearchForm ? 'active flex items-center w-max space-x-3 border rounded border-gray-300 hover:border-gray-400' : ''}`}>


                {showSearchForm && 
                <>
                  <div className="w-30">
                    <FindingMethod inputFindingMethod={inputFindingMethod}
                                  list={findingMethods}
                                  setInputFindingMethod={setInputFindingMethod} /></div>
                  
                  <input value={inputFindStr}
                        onChange={(e) => setInputFindStr(e.target.value)}
                        className="p-2 bg-transparent w-ay focus:outline-none" />

                  <div className="p-1 w-3"
                      onClick={() => {setFindingMethod(inputFindingMethod); setFindStr(inputFindStr);}}>
                      <span className="h-1 w-1 text-gray-300 hover:text-gray-400"><GlassIcon /></span>
                  </div>
                  
                  <div className="pr-8 pl-1 w-3" onClick={() => setSearchForm(false)}>
                      <span className="h-1 w-1 text-gray-300 hover:text-gray-400"><XMark /></span>
                  </div>
                </>}
            </div>
          </div>



          {/* 정렬 */}
          {/* <div className="flex justify-items-end py-2">
            <button onClick={handleSearchForm} className={showSearchForm ? "sort active" : "sort object-right"}><SortIcon /></button>
            <div className={showSortForm ? 
                            "sort-form active bg-white w-96 basis-96 flex items-center space-x-3 border rounded border-gray-300 hover:border-gray-400"
                            : "sort-form"}>
                {showSortForm && <FindingMethod inputFindingMethod={inputFindingMethod}
                                  list={sortMethods}
                                  setInputFindingMethod={setInputFindingMethod} />}

                <div className="p-1 w-3.5"
                    onClick={() => {setSortMethod(inputFindingMethod); setFindStr(inputFindStr);}}>
                    <span className="h-1 w-1 text-gray-300 hover:text-gray-400"><GlassIcon /></span>
                </div>
                
                <div className="p-1 w-3.5" onClick={() => setSearchForm(false)}>
                    <span className="h-1 w-1 text-gray-300 hover:text-gray-400"><XMark /></span>
                </div>
            </div>
        </div> */}


        <div>
          <div className="max-w-4xl bg-white rounded-lg p-4 mx-auto">
            <div className="flex justify-between items-center font-bold mb-4 border-b-2 pb-2">
              <div className="divide-y divide-gray-100"></div>
              <div className="w-1/12 text-center">No</div>
              <div className="w-4/12 text-center">제목</div>
              <div className="w-2/12 text-center">작성일자</div>
              <div className="w-2/12 text-center">작성자</div>
              <div className="w-1/12 text-center">추천수</div>
              <div className="w-1/12 text-center">조회수</div>
            </div>
            {AddFormClass && showAddForm && (
              <div><WriteBoard
                board={{ ...defaultBoard }}
                FormTitle="새로운 게시글 작성"
                handleXButton={handleAddXButton}
                formClass={AddFormClass}
                BoardComplete={CreateBoard}
                
              /></div>
            )}
            <Page params={{ pagenum: pages,findingMethod,findStr }} />
          </div>
        </div>


        <div className="flex mt-4 space-x-2 justify-center items-center z-0">

          {pages>1 && <button onClick={() => setPages(0)}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{"<<"}</button>}
          {pages>1 && <button onClick={() => setPages(pages-2)}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{pages-1}</button>}
          {pages>=1 && <button onClick={() => setPages(pages-1)}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{pages}</button>}
          <p className="bg-pink-500 text-white p-2 rounded relative inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium">{pages+1}</p>
          <button onClick={() => setPages(pages+1)}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{pages+2}</button>
          <button onClick={() => setPages(pages+2)}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">{pages+3}</button>
        </div>

        <div className="fixed bottom-5 right-5 bg-pink-500 hover:bg-black text-white font-bold py-2 px-4 rounded-full"
          onClick={ToggleAddForm}
          style={{ position: "fixed", bottom: "5em", right: "5em" }}>
          게시글 작성하기
        </div>

        
      </div>
      </>
   )}
   else{
    return(<div></div>);
  }
  }

export default function BoardList(props: any): any {
  return <Logined />;
}
