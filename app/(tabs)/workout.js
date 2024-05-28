import { StyleSheet, View, Text, Button, Alert, ScrollView } from "react-native"
import { useForm, FormProvider, SubmitHandler, SubmitErrorHandler } from "react-hook-form"
import { insert_workout } from "../db/workout_calendar_queries"
import { openDatabase } from "../db/db"
import { TextInput } from "../../components/Universal/Input"
import { useState } from "react"

export default Page = () => {
  
  const { ...methods } = useForm()

  const { formState: { errors }, setValue, getValues, watch } = methods

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

  /*
  TODO implement this errors handling
  cannot make more than attempted...
  */
  return (
    <View style={styles.container}>  
      <ScrollView>
        <FormProvider {...methods}>
          {
            target_area.map((item, index) => {
              if(!item.include)
                return
              return (
                <View key={item}>
                  <Text key={item.area+1}>{item.area}</Text>
                    <TextInput
                      key={`${item.area}.makes`+1} 
                      name={`${item.area}.makes`} 
                      label="makes"
                      defaultValue="0"
                      keyboardType="numeric"
                      setFormError={setError}
                      rules={{
                        setValueAs: v => parseInt(v),
                        max: {
                          value: watch(`${item.area}.attempts`),
                          message: "cannot have more makes than attempts!"
                        }
                      }}
                    >
                    </TextInput>
                    <TextInput
                      key={`${item.area}.attempts`+1} 
                      name={`${item.area}.attempts`} 
                      label="attempts"
                      defaultValue="0"
                      keyboardType="numeric"
                      setFormError={setError}
                      rules={{
                        setValueAs: v => parseInt(v),
                      }}
                    >
                    </TextInput>
                </View>
              )
            })
          }
          <Button style={styles.button} title="Submit" onPress={methods.handleSubmit(onSubmit)} />
        </FormProvider>
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
