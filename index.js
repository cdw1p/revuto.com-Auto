const fetch = require('node-fetch')
const moment = require('moment')
const fs = require('fs-extra')
const faker = require('faker')
const delay = require('delay')
const cronJob = require('cron').CronJob
const { Twisters } = require('twisters')
const twisters = new Twisters()
require('colors')

let logMessage, logInfo, randomIP, totalSuccess = 0, totalError = 0, timeoutTimer = 10000

function getString(start, end, all) {
  const regex = new RegExp(`${start}(.*?)${end}`)
  const result = regex.exec(all)
  return result
}

function functionRandomIP() {
  randomIP = (Math.floor(Math.random() * 255) + 1) + '.' + (Math.floor(Math.random() * 255)) + '.' + (Math.floor(Math.random() * 255)) + '.' + (Math.floor(Math.random() * 255))
}

function randNumber(length) {
  const result = []
  const characters = '0123456789'
  for ( var i = 0; i < length; i++ ) result.push(characters.charAt(Math.floor(Math.random() *  characters.length)))
  return result.join('')
}

function randString(length) {
  const result = []
  const characters = '012345678910abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for ( var i = 0; i < length; i++ ) result.push(characters.charAt(Math.floor(Math.random() *  characters.length)))
  return result.join('')
}

const functionRegisterUsers = (firstName, lastName, email, inviteToken) => new Promise((resolve, reject) => {
  fetch(`https://revuto.com/api/v1/auth/register`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36',
      'Content-Type': 'application/json;charset=UTF-8',
      'X-Forwarded-For': randomIP,
      'X-ProxyUser-Ip': randomIP
    },
    body: JSON.stringify({ firstName, lastName, email, inviteToken })
  })
  .then(res => res.json())
  .then(text => resolve(text))
  .catch(err => reject(err))
})

const functionVerifyUsers = (token, password) => new Promise((resolve, reject) => {
  fetch(`https://revuto.com/api/v1/auth/set-password`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Mobile Safari/537.36',
      'Content-Type': 'application/json;charset=UTF-8',
      'Referer': `https://revuto.com/set-password/${token}`,
      'X-Forwarded-For': randomIP,
      'X-ProxyUser-Ip': randomIP
    },
    body: JSON.stringify({ token, password })
  })
  .then(res => res.json())
  .then(text => resolve(text))
  .catch(err => reject(err))
})

const functionGetLink = (email, domain) => new Promise((resolve, reject) => {
  const listDomain = ['emailfake.com', 'generator.email']
  fetch(`https://${listDomain[Math.floor(Math.random() * listDomain.length)]}/${domain}/${email}`, {
    method: 'GET',
    timeout: timeoutTimer,
    headers: {
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
      'accept-encoding': 'gzip, deflate, br',
      'cookie': `_ga=GA1.2.659238676.1567004853; _gid=GA1.2.273162863.1569757277; embx=%5B%22${email}%40${domain}%22%2C%22hcycl%40nongzaa.tk%22%5D; _gat=1; io=io=tIcarRGNgwqgtn40O${randString(3)}; surl=${domain}%2F${email}`,
      'upgrade-insecure-requests': 1,
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
      'X-Forwarded-For': randomIP,
      'X-ProxyUser-Ip': randomIP
    }
  })
  .then(res => res.text())
    .then(text => {
    const data = getString('https://revuto.com/set-password/', '"', text)
    resolve(data ? data[1] : data)
  })
  .catch(err => reject(err))
})

const functionMain = () => new Promise(async (resolve, reject) => {
  // Loop Process
  for (loopProcess = 0; ; loopProcess++) {
    try {
      // Initialize Users Info
      const usersDomains = ['dikitin.com', 'triadstore.eu.org', 'sightmedia.us', 'halonews.us', 'dalnet.uk.to', 'traz.cafe', 'wix.my.id', 'redrive.my.id', 'domtix.ru', 'torprojectorg.ru', 'hotmail.red', 'gmailup.com', 'indozoom.net', 'gmailya.com', 'gmailwe.com']
      const usersFname = await faker.name.firstName().replace(/\W|_/gi, '')
      const usersLname = await faker.name.lastName().replace(/\W|_/gi, '')
      const usersFullname = `${usersFname}${usersLname}${randNumber(5)}`
      const usersDomain = usersDomains[Math.floor(Math.random() * usersDomains.length)]
      const usersEmail = `${usersFullname}@${usersDomain}`.toLowerCase()
      const usersPassword = 'WasdWuyq7HCaXT'
      const usersReferral = 'cahyf712de'
      logInfo = `- Email : ${usersEmail}\n- Fullname : ${usersFname} ${usersLname}\n- Referral Code : ${usersReferral}\n- Total Success : ${`${totalSuccess}`.green.bold}`

      // Registration Users
      logMessage = `[${moment().format('HH:mm:ss')}] Trying to Register New Users...`
      const resRegisterUsers = await functionRegisterUsers(usersFname, usersLname, usersEmail, usersReferral)
      if (resRegisterUsers.id) {
        // Verify New Email
        logMessage = `[${moment().format('HH:mm:ss')}] Trying to Verify Email Verification...`
        let resLinkConfirmation, resVerifyUsers, countLC = 0, countVU = 0
        do {
          resLinkConfirmation = await functionGetLink(usersFullname, usersDomain)
          countLC = countLC + 1
          if (countLC >= 10) break
        } while (!resLinkConfirmation)

        if (resLinkConfirmation !== null) {
          do {
            resVerifyUsers = await functionVerifyUsers(resLinkConfirmation, usersPassword)
            countVU = countVU + 1
            if (countVU >= 10) break
          } while (!resVerifyUsers)

          // Statement Success or Not
          if (resVerifyUsers.user.id) {
            const { token } = resVerifyUsers
            const { id, revuTokens } = resVerifyUsers.user
            logMessage = `[${moment().format('HH:mm:ss')}] Verify Email Verification Success !`

            // Output
            totalSuccess = totalSuccess + 1
            await fs.appendFileSync(`./acc_saved_${moment().format('DD_MM_YY')}.txt`, `${usersEmail}|${usersPassword}|${id}|${revuTokens}|${token}\n`)
          } else {
            logMessage = `[${moment().format('HH:mm:ss')}] Verify Email Verification Failed !`
            totalError = totalError + 1
          }
        } else {
          logMessage = `[${moment().format('HH:mm:ss')}] Verify Email Verification Failed !`
          await delay(60 * 1000)
          return
        }
      } else {
        return
      }
    } catch (err) {
      twisters.put('loading', { text: `[${moment().format('HH:mm:ss')}] Error : ${err.message}`.red.bold })
      totalError = totalError + 1
    }
  }
})

;(async () => {
  // CronJob
  functionMain()
  new cronJob('*/1 * * * *', function () { functionMain() }, null, true, 'Asia/Jakarta').start()
  new cronJob('* * * * * *', async function() {
    await functionRandomIP()
    // Log Output
    twisters.put('loading', { text: `${`${logMessage}`.yellow.bold}\n${logInfo}` })
  }, null, true, 'Asia/Jakarta').start()
})()