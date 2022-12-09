/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ButtonGroup,
  InputAdornment,
  TextField,
} from "@mui/material";
import Upload from "@ui/components/upload";
import { Button, DatePicker } from "antd";
import { type MutableRefObject } from "react";
import { type Data6 } from ".";

const Step6 = ({
  data,
  setData,
  defaultName,uploadRef
}: {
  data: Data6;
  setData: any;
  defaultName: string;
 uploadRef:MutableRefObject<undefined>,
}) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex w-[86%] flex-col items-stretch gap-4">
        <TextField
          label="Nom de l'auction"
          defaultValue={defaultName}
          size="small"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
        <Upload uploadRef={uploadRef} value={data.images} setValue={(v)=>setData({...data,images:v})}/>
        <div className="flex flex-row items-center gap-3">
   
          <TextField
            label="Expected Price"
           
            type="number"
            value={data.expected_price}
            className="flex-grow"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">{"€"}</InputAdornment>
              ),
            }}
            onChange={(e) =>
              setData({ ...data, expected_price: e.target.value })
            }
          />
          

    <ButtonGroup variant="outlined" size="large">
      <Button>One</Button>
      <Button>Two</Button>
      <Button>Three</Button>
    </ButtonGroup>
    </div>
        <div className="w-full">
        <DatePicker 
        showTime={{ format: 'HH:mm' }}
        format="YYYY-MM-DD HH:mm"
        placeholder="Choisir la date fin"
         allowClear  onChange={(v)=>{
            setData({...data,duration:v?.toDate()})
        }} className="w-full border-black/30 active:border-black text-black/70 "/>
     
        </div>
        <TextField
          label="Adresse"
          size="small"
          multiline
          maxRows={2}
          value={data.address}
          onChange={(e) => setData({ ...data, address: e.target.value })}
        />
      </div>
    </div>
  );
};

export default Step6;