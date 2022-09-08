import { useState, useEffect } from "react";

interface PropsType {
  isHistoryOn: boolean;
}

interface HistoryType {
  expression: string;
  result: string;
}

function History({ isHistoryOn }: PropsType) {
  const [history, setHistory] = useState<HistoryType[]>([]);

  const resetHistory = () => {
    localStorage.setItem("calhistory", JSON.stringify([]));
    setHistory([]);
  };

  useEffect(() => {
    if (!localStorage.getItem("calhistory")) {
      localStorage.setItem("calhistory", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    const calhistory = localStorage.getItem("calhistory");
    calhistory && setHistory(JSON.parse(calhistory));
  }, [isHistoryOn]);

  return (
    <div className={`history${isHistoryOn ? " history-visible" : ""}`}>
      <div className="history__header">
        <h3 className="history__headline">히스토리</h3>
        <button className="history__reset" onClick={resetHistory}>
          초기화
        </button>
      </div>
      <div className="history__content">
        {history.length === 0 ? (
          <div className="history__nocontent">
            <span>기록이 없습니다</span>
          </div>
        ) : (
          history.map((el: HistoryType, idx: number) => (
            <div className="history__item" key={idx}>
              <span className="history__expression">{el.expression}</span>
              <span className="history__result">{el.result}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default History;
