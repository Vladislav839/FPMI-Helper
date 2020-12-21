class LinksService {
    static getLink(course) {
        switch(course) {
            case "1":
                return 'http://fpmi.bsu.by/sm_full.aspx?guid=58073';
            case "2":
                return 'http://fpmi.bsu.by/sm_full.aspx?guid=58083'
        }
    }
    // static getCourseLink(course) {
    //     let link = null;
    //     fetch('http://fpmi.bsu.by/ru/main.aspx?guid=20381')
    //     .then(
    //       function(response) {
    //             if (!response.ok) throw new Error("fetch failed");
    //             return response.text()
    //       }
    //     )
    //     .then(function(data) {
    //         const doc = new DOMParser().parseFromString(data, "text/html");
    //         let hrefs = doc.getElementsByTagName('a')
    //         for (let item of hrefs) {
    //             if (item.innerText.includes(`Расписание занятий ${course} курса`)) {
    //                console.log('http://fpmi.bsu.by' + item.getAttribute('href'))
    //             }
    //         }
    //     })
    // }
}