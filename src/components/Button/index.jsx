const Button = ({ label, onClick }) => {
  return (<>
      <button  style={{
          padding: "10px",
          backgroundColor: "blue",
          border: "none",
          color: "white",
          borderRadius: "5px",
          fontSize: "12px",
          fontWeight: "bold",
      }}  onClick={onClick} > {label}</button>
  </>);
}
export default Button;