const TextField = ({ className, label, value, onChange, type, hint }) => {
  return (<>
      <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
      }}>
          <span style={{
              fontWeight: "bold",
              fontSize: "14px"
          }}>{label}</span>
          <input style={{
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",

          }} className={className} value={value} onChange={onChange} type={type} placeholder={hint}></input>
      </div>
  </>);
}
export default TextField;