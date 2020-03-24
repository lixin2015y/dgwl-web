const systemMenu = [
    {
        icon: "pie-chart",
        path: "/system/statistics",
        name: "数据统计",
        key: "count"
    },
    {
        icon: "desktop",
        path: "/system/order",
        name: "订单管理",
        key: "order"
    },
    {
        icon: "car",
        path: "/system/car",
        name: "车辆管理",
        key: "car"
    },
    {
        icon: "user",
        path: "/system/driver",
        name: "司机管理",
        key: "driver"
    },
    {
        icon: "home",
        path: "/system/house",
        name: "仓库管理",
        key: "house"
    },
]


const userMenu = [
    {
        icon: "pie-chart",
        path: "/system/myOrder",
        name: "我的订单",
        key: "count"
    }
]
const menu = {
    userMenu,
    systemMenu
}


export default menu