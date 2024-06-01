import { TextInput } from "../Universal/Input"
import { useFormContext } from "react-hook-form"

export const TwoFoldInput = ( area ) => {

  const { register, watch } = useFormContext()

  const counterpart_value = watch(`${area.db_field}.attempts`, 0) // default to 0
  
  console.log(useFormContext())
  console.log("register function value", register)


  return (
    <>
      <TextInput
        name={`${area.db_field}.makes`}
        label="makes"
        defaultValue="0"
        keyboardType="numeric"
        rules={{
          setValueAs: v => parseInt(v),
          max: {
            value: counterpart_value,
            message: "cannot have more makes than attempts!"
          }
        }}
      >
      </TextInput>
      <TextInput
        name={`${area.db_field}.attempts`}
        label="attempts"
        defaultValue="0"
        keyboardType="numeric"
        rules={{
          setValueAs: v => parseInt(v),
        }}
      ></TextInput>
    </>
  )

}