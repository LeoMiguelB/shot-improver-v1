

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
    useWatch
} from 'react-hook-form';


/*
SYNOPSIS
Will need to refactor this since ideally we make Controlled input universally an input and not just for makes and attempts.
With that aside, the idea here is that we watch the counter part of the current action. That is if we are on makes, then we watch on attempts so that
we can check if we more makes than attempts which is not valid. By using the useWatch hook here we avoid re-rendering the component the whole component using this.
*/

const ControlledInput = (props) => {
  const formContext = useFormContext()

  const { formState } = formContext

  const {
    name,
    label,
    defaultValue,
    ...inputProps
  } = props

  const two_part_name = name.split(".")
  const area = two_part_name[0] // this is the area
  const action = two_part_name[1] // this is either makes or attempts
  
  const counterpart_value = useWatch({name: `${area}.${(action == "makes") ? "attempts" : "makes"}`, defaultValue: 0}) // watch the counter part value

  rules = { // base object for the form
    setValueAs: v => parseInt(v),
  }

  // we will enforce max val on makes and min val on attempts
  if(action == "makes") {
    rules = {
      ...rules,
      max: {
        value: counterpart_value,
        message: "cannot make more attempts than makes"
      } 
    }
  } else {
    rules = {
      ...rules,
      min: {
        value: counterpart_value,
        message: "cannot make more attempts than makes"
      }
    }
  }

  const { field } = useController({ name, rules, defaultValue })
  
  let message = null

  if(formState?.errors){
    if(formState?.errors[area] && formState?.errors[area][action]) {
      message = formState?.errors[area][action].message
      console.log(message)
    }
  }

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
          {message && <Text style={styles.error}>{message}</Text>}
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

    return null
  }

  return (
    <ControlledInput {...props} />
  );
};


const styles = StyleSheet.create({
  label: {
    color: 'black',
    margin: 20,
    marginLeft: 0,
  },
  container: {
    flex: -1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: 'transparent',
    },
  input: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
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
