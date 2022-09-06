interface HistoryType {
  expression: string;
  result: string;
}

function History() {
  const parsed = JSON.parse(localStorage.getItem("calhistory")!);

  const resetHistory = () => {
    localStorage.setItem("calhistory", JSON.stringify([]));
  };

  return (
    <div className="history">
      <div className="history__header">
        <h3 className="history__headline">히스토리</h3>
        <button className="history__reset" onClick={resetHistory}>
          초기화
        </button>
      </div>
      {parsed.map((el: HistoryType, idx: number) => (
        <div className="history__item" key={idx}>
          <span className="history__expression">{el.expression}</span>
          <span className="history__result">{el.result}</span>
        </div>
      ))}
    </div>
  );
}

export default History;
