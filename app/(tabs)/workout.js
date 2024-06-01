import { StyleSheet, View, Text, Button, Alert, ScrollView } from "react-native"
import { useForm, FormProvider} from "react-hook-form"
import { insert_workout } from "../db/wc_queries"
import { openDatabase } from "../db/db"
import { TextInput } from "../../components/Universal/Input"
import { useState } from "react"

export default Page = () => {
  
  const { watch, ...methods } = useForm()
  
  const [formError, setError] = useState(false) // passed setError in input

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
      area: "Three Second Area",
      db_field: "three_sec_area",
      include: true,
    },
    {
      area: "Left Block",
      db_field: "left_block",
      include: true,
    },
    {
      area: "Right Block",
      db_field: "right_block",
      include: false,
    },
    {
      area: "Left Elbow",
      db_field: "left_elbow",
      include: false,
    },
    {
      area: "Right Elbow",
      db_field: "right_elbow",
      include: false,
    },
    {
      area: "Top of Circle",
      db_field: "top_of_circle",
      include: false,
    },
    {
      area: "Left Wing",
      db_field: "left_wing",
      include: false,
    },
    {
      area: "Right Wing",
      db_field: "right_wing",
      include: false,
    },
    {
      area: "Left Corner",
      db_field: "left_corner",
      include: false,
    },
    {
      area: "Right Corner",
      db_field: "right_corner",
      include: false,
    },
    {
      area: "Left Short Corner",
      db_field: "left_short_corner",
      include: false,
    },
    {
      area: "Right Short Corner",
      db_field: "right_short_corner",
      include: false,
    },
    {
      area: "Free Throw Line",
      db_field: "free_throw_line",
      include: false,
    }
  ];
  

  /*
  TODO:
  real time form validation only works after intitial submit
  */
  return (
    <View style={styles.container}>  
      <ScrollView>
        <FormProvider {...methods}>
          {
            target_area.map((item) => {
              if(!item.include)
                return

              return (
                <View key={item.area}>
                  <Text>{item.area}</Text>
                    <TextInput
                      name={`${item.db_field}.makes`} 
                      label="makes"
                      defaultValue="0"
                      keyboardType="numeric"
                      setFormError={setError}
                      rules={{
                        setValueAs: v => parseInt(v),
                        max: {
                          value: watch(`${item.db_field}.attempts`),
                          message: "cannot have more makes than attempts!"
                        }
                      }}
                    >
                    </TextInput>
                    <TextInput
                      name={`${item.db_field}.attempts`} 
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
