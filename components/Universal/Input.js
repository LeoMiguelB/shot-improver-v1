

import React from 'react';
import { 
    View, 
    TextInput as RNTextInput, 
    TextInputProps as RNTextInputProps, 
    Text, 
    StyleSheet } from 'react-native';

/* IMPORT HOOKS AND PROPS TYPES */
import { 
    useController, 
    useFormContext, 
    ControllerProps, 
    UseControllerProps 
} from 'react-hook-form';

const ControlledInput = (props) => {
  const formContext = useFormContext();

  const { formState } = formContext;

  const {
    name,
    label,
    rules,
    defaultValue,
    ...inputProps
  } = props;

  const { field } = useController({ name, rules, defaultValue });


  const two_part_name = name.split(".");
  const area = two_part_name[0]; // this is the area
  const action = two_part_name[1]; // this is either makes or attempts
  
  let message = ""

  if(formState?.errors){
    if(formState?.errors[area] && formState?.errors[area][action]) {
      message = formState?.errors[area][action].message
      console.log(message)
    }
  }

  console.log("field change causing re-renders")

  return (
    <View style={styles.container}>
      {label && (<Text style={styles.label}>{label}</Text>)}
      <View>
        <RNTextInput
          autoCapitalize="none"
          textAlign="left"
          style={styles.input}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          value={`${field.value}`}
          {...inputProps}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{message}</Text>
        </View>
      </View>
    </View>

  );
}

export const TextInput = (props) => {

  const {
    name,
  } = props;

  const formContext = useFormContext();

  if (!formContext || !name) {
    const msg = !formContext ? "TextInput must be wrapped by the FormProvider" : "Name must be defined"
    console.error(msg)
    setFormError(true)
    return null
  }

  return <ControlledInput {...props} />;

};


const styles = StyleSheet.create({
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
  },
  container: {
    flex: -1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#0e101c',
    borderColor: 'white',
    borderWidth: 1
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
  errorContainer: {
    flex: -1,
    height: 25
  },
  error: {
    color: 'red'
  }
});