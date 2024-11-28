import {createGlobalStyle} from "styled-components";

const GlobalStyle = createGlobalStyle`

  /* 웹킷 기반 브라우저용 스크롤바 */
  *::-webkit-scrollbar {
    width: 10px;
  }

  *::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 5px;
  }

  *::-webkit-scrollbar-thumb {
    background: #eb3553;
    border-radius: 5px;
    background: linear-gradient(180deg, #eb3553 0%, #ff4d6a 100%);
  }

  *::-webkit-scrollbar-thumb:hover {
    background: #d42e4a;
    background: linear-gradient(180deg, #d42e4a 0%, #eb3553 100%);
  }
`;

export default GlobalStyle;
