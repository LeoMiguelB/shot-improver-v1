import { Button, DataTable } from "react-native-paper";
import { target_area } from "../app/constants";

export const DataViewerTable = (props) => {

  const { shotData } = props;

  return (
    <>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Area</DataTable.Title>
          <DataTable.Title>Makes/Attempts</DataTable.Title>
        </DataTable.Header>

        {
          Object.keys(shotData).map((shot) => {
            if(shotData[shot] == null)
              return
            
            return (
              <DataTable.Row>
                <DataTable.Cell>
                  {target_area.find(item => item.db_field == shot).area}  
                </DataTable.Cell>
                <DataTable.Cell>
                  {shotData[shot]}  
                </DataTable.Cell>
              </DataTable.Row>
            )
          })
        }
      </DataTable>
    </>
  )
}