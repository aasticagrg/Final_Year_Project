import "./style.css"

const Button = ({ label, onClick, type }) => {
  return (<>
      <button 
    
        type= {type} onClick={(e) =>{
        onClick && onClick(e)
       }} > 
        {label}
      </button>
  </>);
}
export default Button;