const express = require('express')
const shortId = require('shortid')
const createhttpError = require('http-errors')
const { dbConnection } = require('./database/db.config')
const ShortUrl =  require('./models/url.model')
const path = require('path')

const port = process.env.PORT || 3081

const app =  express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

dbConnection()

app.set('view engine', 'ejs')

app.get('/', async(req, res, next) => {
    res.render('index')
})

app.post('/', async (req, res, next) => {
    try {
        const { url } = req.body
        if(!url){
            throw createhttpError.BadRequest('provide a valid Url')
        }
        const urlExist = await ShortUrl.findOne({ url })
        if(urlExist){
            res.render('index', { short_url: `${req.headers.host}/${urlExist.shortId}`})
            return
        }
        const shortUrl = new ShortUrl({url: url, shortId: shortId.generate()})
        const result = await shortUrl.save()
        res.render('index', {
            short_url: `${req.headers.host}/${result.shortId}`,
        })
    } catch (error) {
        next(error)
    }
})

app.get('/:shortId', async (req, res, next) => {
    try {
        const { shortId } = req.params
        const result = await ShortUrl.findOne({ shortId })
        if(!result){
            throw new createhttpError.NotFound('short url does not exist')
        }   
        res.redirect(result.url)
    } catch (error) {
        next(error)
    }
})

app.use((req, res, next) => {
    next(createhttpError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('index', { error: err.message })
})

app.listen(port, () => console.log(`server run on port ${port}`))