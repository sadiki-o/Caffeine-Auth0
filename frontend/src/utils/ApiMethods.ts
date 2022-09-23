import axios from "axios";

const ApiBaseUrl = import.meta.env.VITE_BASE_URL

                    //      Drinks end point

// Get public drinks
export const getPublicDrinks = async (): Promise<[]> => {
    let drinks: [] = [];

    var config = {
        method: 'get',
        url: `${ApiBaseUrl}/drinks`,
    };
    await axios(config)
        .then((response) => {
            drinks = response.data['drinks']
        }) 
    return drinks;
}

// get private drinks (barista)
export const getDetailedDrinks = async (token: string): Promise<[]> => {
    let drinks: [] = [];

    var config = {
        method: 'get',
        url: `${ApiBaseUrl}/drinks-detail`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((response) => {
            drinks = response.data['drinks']
        }) 
    return drinks;
}

export const insertDrink = async (token: string, title: string, recipe: string): Promise<boolean> => {
    let resp: boolean = false
    var config = {
        method: 'post',
        url: `${ApiBaseUrl}/drinks`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: {
            title,
            recipe
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        })
    return resp
}

export const updateDrink = async (token: string, drink_id: number, title: string, recipe: string): Promise<boolean> => {
    let resp: boolean = false
    var config = {
        method: 'patch',
        url: `${ApiBaseUrl}/drinks/${drink_id}`,
        headers: {
            'Authorization': `Bearer ${token}`
        },
        data: {
            title,
            recipe,
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        })
    return resp
}

export const deleteDrink = async (token: string, drink_id: string): Promise<boolean> => {
    let resp: boolean = false 
    var config = {
        method: 'delete',
        url: `${ApiBaseUrl}/drinks/${drink_id}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        })
    return resp
}

                    //      Admin end point

export const deleteUserForAdmin = async (token: string, user_id: string): Promise<boolean> => {
    let resp:boolean = false
    
    var config = {
        method: 'delete',
        url: `${ApiBaseUrl}/users/${user_id}`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        })
    return resp
}

export const blockUserForAdmin = async (token: string, user_id: string): Promise<boolean> => {
    let resp: boolean = false
    var config = {
        method: 'patch',
        url: `${ApiBaseUrl}/users/${user_id}/block`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        })
    return resp
}

export const unblockUserForAdmin = async (token: string, user_id: string): Promise<boolean> => {
    let resp: boolean = false
    var config = {
        method: 'patch',
        url: `${ApiBaseUrl}/users/${user_id}/unblock`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        })
    return resp
}

export const getManagers = async (token: string): Promise<[]> => {
    let managers: [] = [];

    var config = {
        method: 'get',
        url: `${ApiBaseUrl}/managers`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((response) => {
            managers = response.data['managers']
        }) 
    return managers;
}

export const getBaristas = async (token: string): Promise<[]> => {
    let baristas: [] = [];

    var config = {
        method: 'get',
        url: `${ApiBaseUrl}/baristas`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((response) => {
            baristas = response.data['baristas']
        }) 
    return baristas;
}


                //  Manager Endpoint


export const blockBaristaForManager = async (token: string, barista_id: string): Promise<boolean> => {
    let resp: boolean = false
    var config = {
        method: 'patch',
        url: `${ApiBaseUrl}/baristas/${barista_id}/block`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        })
    return resp
}

export const unblockBaristaForManager = async (token: string, barista_id: string): Promise<boolean> => {
    let resp: boolean = false
    var config = {
        method: 'patch',
        url: `${ApiBaseUrl}/baristas/${barista_id}/unblock`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        })
    return resp
}


                //  Manager Endpoint


export const blockManagerForAdmin= async (token: string, manager_id: string): Promise<boolean> => {
    let resp: boolean = false;
    var config = {
        method: 'patch',
        url: `${ApiBaseUrl}/managers/${manager_id}/block`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((res) => {
            return res.data.success ? resp = true : resp = false
        }).catch((err) => {
            console.log(err)
        })
    return resp
}

export const unblockManagerForAdmin = async (token: string, manager_id: string): Promise<boolean> => {
    let resp: boolean = false;
    var config = {
        method: 'patch',
        url: `${ApiBaseUrl}/managers/${manager_id}/unblock`,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    await axios(config)
        .then((res) => {
            res.data.success ? resp = true : resp = false
        }).catch((err) => {
            console.log(err)
        })
    return resp
}