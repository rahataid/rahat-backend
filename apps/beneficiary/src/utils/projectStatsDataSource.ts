// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.

export const projectStats = (uuid) => {

    const url = process.env.BACKEND_URL

    if (!uuid) {
        return {
            "dataSources": {
                "source2": {
                    "type": "url",
                    "args": {
                        "url": `${url}/v1/beneficiaries/stats`
                    },
                    "data": []
                }
            },
            "ui": [
                [
                    {
                        "title": "Gender",
                        "type": "pie",
                        "props": {},
                        "dataSrc": "source2",
                        "dataMap": `BENEFICIARY_GENDER`,
                        "colSpan": 1,
                        "rowSpan": 2
                    }
                ],
                [
                    {
                        "title": "Beneficiary Internet Status",
                        "type": "pie",
                        "props": {},
                        "dataSrc": "source2",
                        "dataMap": `BENEFICIARY_INTERNETSTATUS`,
                        "colSpan": 1,
                        "rowSpan": 1
                    }
                ],
                [
                    {
                        "title": "Beneficiary Internet Status",
                        "type": "donut",
                        "props": {},
                        "dataSrc": "source2",
                        "dataMap": `BENEFICIARY_INTERNETSTATUS`,
                        "colSpan": 1,
                        "rowSpan": 1
                    }
                ]
            ]
        }
    }
    return {
        "dataSources": {
            "source2": {
                "type": "url",
                "args": {
                    "url": `${url}/v1/projects/${uuid}/stats`
                },
                "data": []
            }
        },
        "ui": [
            [
                {
                    "title": "Gender",
                    "type": "pie",
                    "props": {},
                    "dataSrc": "source2",
                    "dataMap": `BENEFICIARY_GENDER_ID_${uuid}`,
                    "colSpan": 1,
                    "rowSpan": 2
                },
                {
                    "title": "Genders",
                    "type": "bar",
                    "props": {},
                    "dataSrc": "source2",
                    "dataMap": `BENEFICIARY_GENDER_ID_${uuid}`,
                    "colSpan": 1,
                    "rowSpan": 1
                }
            ],
            [
                {
                    "title": "Beneficiary Internet Status",
                    "type": "donut",
                    "props": {},
                    "dataSrc": "source2",
                    "dataMap": `BENEFICIARY_INTERNETSTATUS_ID_${uuid}`,
                    "colSpan": 1,
                    "rowSpan": 1
                }
            ]
        ]
    }

}