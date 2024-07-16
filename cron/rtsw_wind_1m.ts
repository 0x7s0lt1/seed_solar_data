import { schedule, ScheduledTask } from "node-cron";
import { json2csv } from 'json-2-csv';
import {gitHubService} from "../services/gitHubService";

type rtsw_wind_1m_type = {
    time_tag: string,  //
    proton_speed: number,
    proton_temperature: number,
    proton_density: number,
    proton_sample_size: number,
    v: number
}
export const rtsw_wind_1m = async (): Promise<ScheduledTask> | ScheduledTask => {
    return schedule('* * * * *', async () => {

        const filePath = "data/RTSW_WIND_1M.csv";

        try{

            const enlil = await fetch("https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json");
            const enlil_data = await enlil.json();

            let cleaned_data: rtsw_wind_1m_type[] = [];

            enlil_data.forEach((e: any) => {

                date = e.split("T")[0].replace("-", "");

                // @ts-ignore
                const idx = cleaned_data.findIndex(_e => _e.time_tag === date);

                if(idx === -1) {
                    cleaned_data.push({
                        time_tag: date,
                        proton_speed: e.proton_speed,
                        proton_temperature: e.proton_temperature,
                        proton_density: e.proton_density,
                        proton_sample_size: e.proton_sample_size,
                        v: 0
                    })
                }else{

                    cleaned_data[idx].proton_speed = cleaned_data[idx].proton_speed < e.proton_speed ? cleaned_data[idx].proton_speed : e.proton_speed;
                    cleaned_data[idx].proton_temperature = cleaned_data[idx].proton_temperature < e.proton_temperature ? cleaned_data[idx].proton_temperature : e.proton_temperature;
                    cleaned_data[idx].proton_density = cleaned_data[idx].proton_density < e.proton_density ? cleaned_data[idx].proton_density : e.proton_density;
                    cleaned_data[idx].proton_sample_size = cleaned_data[idx].proton_sample_size < e.proton_sample_size ? cleaned_data[idx].proton_sample_size : e.proton_sample_size;

                }


            });

            const csv = await json2csv(cleaned_data);


            console.log(csv);


            gitHubService.writeFile( filePath, csv );


        }catch (error) {
            console.log(error);
        }

    });
}