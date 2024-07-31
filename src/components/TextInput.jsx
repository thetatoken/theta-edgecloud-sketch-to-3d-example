export const TextInput = ({label, value, onChange, placeholder, type, ...props}) => {
  return (
    <div className={"TextInput"}>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} {...props} />
    </div>
  );
}