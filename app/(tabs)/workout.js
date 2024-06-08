import { StyleSheet, View, Text, Button, Alert, ScrollView } from "react-native"
import { useForm, FormProvider} from "react-hook-form"
import { insert_workout } from "../db/wc_queries"
import { openDatabase } from "../db/db"
import { TextInput } from "../../components/Universal/Input"
import { target_area } from "../constants"

export default Page = () => {
  
  const { watch, ...methods } = useForm()

  const onSubmit = async (data) => {
    console.log("inside workout tab ", data)

    Alert.alert('data', JSON.stringify(data))

    
    const db = await openDatabase()

    console.log('inside onSubmit ', db)

    insert_workout(db, data)
  }


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
                  >
                  </TextInput>
                  <TextInput
                    name={`${item.db_field}.attempts`} 
                    label="attempts"
                    defaultValue="0"
                    keyboardType="numeric"
                  >
                  </TextInput>
                </View>
              )
            })
          }
        </FormProvider>
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
