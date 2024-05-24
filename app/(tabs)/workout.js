import { StyleSheet, View, Text, Button, Alert, ScrollView } from "react-native"
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler } from "react-hook-form"
import { insert_workout } from "../db/workout_calendar_queries"
import { openDatabase } from "../db/db"
import { TextInput } from "../../components/Universal/Input"
import { useState } from "react"

export default Page = () => {
  
  const { ...methods } = useForm()

  const { formState: { errors }, setValue, getValues,  } = methods

  const setFError = methods.setError
  
  const [formError, setError] = useState(false)

  const onSubmit = (data) => {
    console.log(data)
    Alert.alert('data', JSON.stringify(data));
    const db = openDatabase()
    insert_workout(db, data)
  }

  /*
  these are the same field names in db
  ideally introspect db instead of hard coding this
  */
  const target_area = [
    {
      area: "three_sec_area",
      include: true,
    },
    {
      area: "left_block",
      include: false,
    },
    {
      area: "right_block",
      include: false,
    },
    {
      area: "left_elbow",
      include: false,
    },
    {
      area: "right_elbow",
      include: false,
    },
    {
      area: "top_of_circle",
      include: false,
    },
    {
      area: "left_wing",
      include: false,
    },
    {
      area: "right_wing",
      include: false,
    },
    {
      area: "left_corner",
      include: false,
    },
    {
      area: "right_corner",
      include: false,
    },
    {
      area: "left_short_corner",
      include: false,
    },
    {
      area: "right_short_corner",
      include: false,
    },
    {
      area: "free_throw_line",
      include: false,
    }
  ];

  const isValidFraction = (name, counterpart, component, input) => {
    // no need to clean input since we were setting it cleaned in the first place

    console.log("input isValidFraction ", input)
    
    let truth = true
    
    setValue(name, input)

    console.log("component: ", component)
    console.log("curr and counterpart: ", getValues(name), getValues(counterpart))
  
    if(component == "numerator" && getValues(name) > getValues(counterpart)) {
      setError(name, {type: "custom", "message": "cannot have more makes than attempts"})
      truth = false
    } else if (component == "denominator" && getValues(name) < getValues(counterpart)) {
      truth = false     
    }

    console.log("truth value ", truth)

    setFError(name, { type: "custom", "message": "cannot make more than you attempt"})

    return truth
  }

  const handleNumberChange = (input) => {
    const { target: {name, value} } = input;

    console.log(input)

    console.log(name, value)

    const cleanedValue = value.replace(/[^0-9]/g, '')
    const parsedValue = parseInt(cleanedValue, 10)

    if(isNaN(parsedValue))
      return

    setValue(name, parsedValue)
  }

  /*
  TODO implement this errors handling
  cannot make more than attempted...
  */
  return (
    <View style={styles.container}>  
      <ScrollView>
        {
          target_area.map((item, index) => {
            if(!item.include)
              return
            return (
              <View key={item}>
                <Text key={item.area+1}>{item.area}</Text>
                <FormProvider key="form-provider-1" {...methods}>
                  <TextInput
                    key={`${item.area}.makes`+1} 
                    name={`${item.area}.makes`} 
                    label="makes"
                    defaultValue="0"
                    keyboardType="numeric"
                    setFormError={setError}
                    rules={{
                      onChange: (val) => handleNumberChange(val),
                      validate: (val) => isValidFraction(`${item.area}.makes`,`${item.area}.attempts`, "numerator", val),
                    }}
                  >
                  </TextInput>
                </FormProvider>
                <FormProvider key="form-provider-2" {...methods}>
                  <TextInput
                    key={`${item.area}.attempts`+1} 
                    name={`${item.area}.attempts`} 
                    label="attempts"
                    defaultValue="0"
                    keyboardType="numeric"
                    setFormError={setError}
                    rules={{
                      onChange: (val) => handleNumberChange(val),
                      validate: (val) => isValidFraction(`${item.area}.attempts`,`${item.area}.makes`, "denominator", val),
                      
                    }}
                  >
                  </TextInput>
                </FormProvider>
              </View>
            )
          })
        }
        <Button style={styles.button} title="Submit" onPress={methods.handleSubmit(onSubmit)} />
      </ScrollView>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  error: {
    position: "absolute",
    bottom: 0,
    color: "red",
    fontSize: 12
  },
  button: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 20
  },
  input: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 5,
    fontSize: 16,
    height: 40,
    color: '#c0cbd3',
  },
});
