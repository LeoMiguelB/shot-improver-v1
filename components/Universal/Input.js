/*
reference -> https://legacy.reactjs.org/docs/hooks-rules.html
*/

import React from 'react';

import { View, TextInput as RNTextInput, Text, StyleSheet } from 'react-native';

import { useController, useFormContext } from 'react-hook-form';


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

  const hasError = Boolean(formState?.errors[name]);

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
          {hasError && (<Text style={styles.error}>{formState.errors[name].message}</Text>)}
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
    borderColor: 'none',
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