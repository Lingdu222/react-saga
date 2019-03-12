module.exports = {
    'GET /api/test1': (req, res) => res.json({
        errno: 0,
        errmsg: '',
        data: '想看到彩蛋吗?'
    }),
    'GET /api/test2': (req, res) => res.json({
        errno: 0,
        errmsg: '',
        data: '哈哈，没有^_^'
    })
};
