import react, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { PortfolioItem } from './PortfolioItem';
import StudentService from "../../../services/studentService";

function getData() {
    return [
        {
            workshop: {
                title: {
                    am: "Աշխատարան 1",
                    en: "Workshop 1"
                }
            },
            photo: null,
            date: new Date(),
            heading: {
                am: "Աշխատարան 1 Վերնագիր",
                en: "Workshop 1 Heading"
            },
            description: {
                am: "Աշխատարան 1 Նկարագրություն",
                en: "Workshop 1 Description"
            }
        },
        {
            workshop: {
                title: {
                    am: "Աշխատարան 2",
                    en: "Workshop 2"
                }
            },
            photo: null,
            date: new Date(),
            heading: {
                am: "Աշխատարան 2 Վերնագիր",
                en: "Workshop 2 Heading"
            },
            description: {
                am: "Աշխատարան 2 Նկարագրություն",
                en: "Workshop 2 Description"
            }
        },
        {
            workshop: {
                title: {
                    am: "Աշխատարան 3",
                    en: "Workshop 3"
                }
            },
            photo: null,
            date: new Date(),
            heading: {
                am: "Աշխատարան 3 Վերնագիր",
                en: "Workshop 3 Heading"
            },
            description: {
                am: "Աշխատարան 3 Նկարագրություն",
                en: "Workshop 3 Description"
            }
        },
        {
            workshop: {
                title: {
                    am: "Աշխատարան 4",
                    en: "Workshop 4"
                }
            },
            photo: null,
            date: new Date(),
            heading: {
                am: "Աշխատարան 4 Վերնագիր",
                en: "Workshop 4 Heading"
            },
            description: {
                am: "Աշխատարան 4 Նկարագրություն",
                en: "Workshop 4 Description"
            }
        },
        {
            workshop: {
                title: {
                    am: "Աշխատարան 5",
                    en: "Workshop 5"
                }
            },
            photo: null,
            date: new Date(),
            heading: {
                am: "Աշխատարան 5 Վերնագիր",
                en: "Workshop 5 Heading"
            },
            description: {
                am: "Աշխատարան 5 Նկարագրություն",
                en: "Workshop 5 Description"
            }
        },
        {
            workshop: {
                title: {
                    am: "Աշխատարան 6",
                    en: "Workshop 6"
                }
            },
            photo: null,
            date: new Date(),
            heading: {
                am: "Աշխատարան 6 Վերնագիր",
                en: "Workshop 6 Heading"
            },
            description: {
                am: "Աշխատարան 6 Նկարագրություն",
                en: "Workshop 6 Description"
            }
        },
    ]
}

export const Portfolio = (props) => {
    const {t} = useTranslation();
    const [data, setData] = useState(null)
    useEffect(()=>{
        StudentService.getPortfolio().then((res)=>setData(res.data)).catch(console.error);
    }, [])

    return (
        <div>
            <h2 className="text-center">{t('textPortfolio')}</h2>
            <div className="d-flex flex-wrap row">
                {data ? data.length ? data.map((x, i) => <PortfolioItem data={x} key={i}/>) : "O elements" : "There is no works in your portfolio yet."}
            </div>
        </div>
    )
}