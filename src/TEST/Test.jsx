// import { useState, useEffect, useRef, useCallback } from "react";
// import useMeasure from "react-use-measure";

import { useState } from "react";

// const Thread = () => {
//   const initialState = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];
//   const ListStyle = {
//     height: "400px",
//     width: "calc(100% - 40px)",
//     backgroundColor: "lightcoral",
//     overflowX: "hidden",
//     overflowY: "scroll",
//   };
//   const ListItemStyle = {
//     margin: "4px 0",
//     height: "100px",
//     width: "100%",
//     backgroundColor: "lightgreen",
//   };
//   const ContainerStyle = {
//     margin: "",
//     position: "relative",
//     width: "100%",
//   };

//   const [items, setItems] = useState(initialState);
//   const [loading, setLoading] = useState(false);
//   const scrollRef = useRef(null);
//   const dummyRef = useRef(null);
//   const heightRef = useRef(0);
//   const [ref, { height: newHeight }] = useMeasure();

//   const handleScrollToTop = () => {
//     setLoading(true);
//     setTimeout(() => {
//       setItems((s) => [
//         ...s,
//         ...Array(5)
//           .fill()
//           .map((a, index) => {
//             return { id: items.length + index + 1 };
//           }),
//       ]);
//       setLoading(false);
//     }, 200);
//   };

//   const scrollToBottom = useCallback(() => {
//     setTimeout(() => {
//       dummyRef.current.scrollIntoView();
//     }, 1);
//   }, []);

//   const scrollToLast = useCallback(() => {
//     if (newHeight > heightRef.current) {
//       scrollRef.current.scrollTop = newHeight - heightRef.current;
//       heightRef.current = newHeight;
//     }
//   }, [newHeight]);

//   useEffect(() => {
//     if (!scrollRef.current || !dummyRef.current) {
//       return;
//     }

//     if (items.length <= 5) {
//       heightRef.current = newHeight;
//       scrollToBottom();
//       return;
//     }

//     scrollToLast();
//   }, [scrollToBottom, scrollToLast, items]);

//   const handleOnScroll = () => {
//     if (scrollRef.current.scrollTop === 0) {
//       handleScrollToTop();
//     }
//   };

//   return (
//     <div>
//       <h1>Thread</h1>
//       <button
//         style={{ width: "100%" }}
//         onClick={() => {
//           setLoading(true);
//           setTimeout(() => {
//             setItems([...initialState.slice(1, 5), { id: Math.random() }]);
//             setLoading(false);
//           }, 200);
//         }}
//       >
//         Add new
//       </button>
//       <div style={ContainerStyle}>
//         <div ref={scrollRef} onScroll={handleOnScroll} style={ListStyle}>
//           <div ref={ref}>
//             {items.map((item) => (
//               <div key={item.id} style={ListItemStyle}>
//                 {loading && <div>Loading </div>}
//                 {`Item ${item.id}`}
//               </div>
//             ))}
//             <div ref={dummyRef} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Thread;

const Test = () => {
  const [file, setFile] = useState("");
  const handleSend = async () => {
    const data = await fetch("https://real-talk-backend.onrender.com/helloworld", {
      method: "get",
      credentials: "include",
    });
    const res = await data.json();
    setFile(res);
    console.log(res);
  };
  return (
    <div>
      {/* {file} */}
      {/* <input type="file" onChange={(e) => setFile(e.target.files[0])} /> */}
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default Test;
