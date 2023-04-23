import {useEffect, useState} from "react";
import {Pie} from "react-chartjs-2";

export const BedFundStat = ({ bedFund }) => {
    const [ info, setInfo ] = useState({
        labels: bedFund.map((data) => data.status),
        datasets: [
            {
                label: "Загруженность коечного фонда",
                data: bedFund.map((data) => parseInt(data.count)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                ],
                borderWidth: 2,
            },

        ],
    });

    useEffect(() => {
        setInfo({
            labels: bedFund.map((data) => data.status),
            datasets: [
                {
                    label: "Загруженность коечного фонда",
                    data: bedFund.map((data) => parseInt(data.count)),
                    backgroundColor: [
                        'rgba(253,72,111, 0.2)',
                        'rgba(100,239,59,0.2)'
                    ],
                    borderColor: [
                        'rgb(253,72,111)',
                        'rgb(100,239,59)',
                    ],
                    borderWidth: 2,
                },

            ],
        })
    }, [ bedFund ]);


    return <Pie data={info} />

}