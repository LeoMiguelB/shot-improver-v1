import { StyleSheet, View, Text, Button, Alert, ScrollView, TextInput } from "react-native"
import { useForm } from "react-hook-form"
import { insert_workout } from "../db/workout_calendar_queries"
import { openDatabase } from "../db/db"

export default Page = () => {
  const { handleSubmit, register, setValue, setError, formState: { errors } } = useForm()


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

  const handleNumberChange = (name, input) => {
    const cleanedValue = input.replace(/[^0-9]/g, '')
    const parsedValue = parseInt(cleanedValue, 10)

    console.log(parsedValue)

    if(!isNaN(parsedValue)) {
      setValue(name, input)
    }
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
                {/* TODO make these inputs required */}
                <TextInput
                  key={`${item.area}.makes`+1} 
                  {...register(`${item.area}.makes`)}
                  name={`${item.area}.makes`} 
                  label="makes"
                  keyboardType="numeric"
                  defaultValue="0"
                  style={[
                    styles.input,
                    { borderColor: errors[`${item.area}.makes`] ? '#fc6d47' : '#c0cbd3' },
                  ]}
                  onChangeText={(text) => {handleNumberChange(`${item.area}.makes`, text)}}
                />
                <TextInput
                  key={`${item.area}.attempts`+1} 
                  {...register(`${item.area}.attempts`)}
                  name={`${item.area}.attempts`} 
                  label="attempts"
                  keyboardType="numeric"
                  defaultValue="0"
                  style={[
                    styles.input,
                    { borderColor: errors[`${item.area}.attempts`] ? '#fc6d47' : '#c0cbd3' },
                  ]}
                  onChangeText={(text) => {handleNumberChange(`${item.area}.attempts`, text)}}
                />
              </View>
            )
          })
        }
        <Button style={styles.button} title="Submit" onPress={handleSubmit(onSubmit)} />
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
