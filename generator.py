import requests
import time
import traceback
import hashlib
import random
import string
import threading
import datetime
import os
import asyncio
import websockets
import sys
import hmac
import base64
import json
from colorama import Fore, init
from concurrent.futures import ThreadPoolExecutor
from timeit import default_timer as timer
from datetime import timedelta
from requests.adapters import HTTPAdapter
from keyauth import api


def getchecksum():
    md5_hash = hashlib.md5()
    file = open(''.join(sys.argv), "rb")
    md5_hash.update(file.read())
    digest = md5_hash.hexdigest()
    return digest


thread_lock = threading.Lock()
config = json.load(open('config.json'))
promo_sent = 0
generated_promo = 0
proxies = config['proxies']
kopeecha_key = config['kopeecha_key']
mail_type = config['mail_type']


class Mails:
    def __init__(self):
        self.mails = {}  # this map contains mails which should be checked in the next loop

    def add_mail(self, mail):
        self.mails[mail] = time.time()

    def mail_not_received(self, mail):
        self.mails[mail] = time.time() + 15  # current epoch + 15 seconds

    def mail_received(self, mail):
        del self.mails[mail]

    def get_loop_mails(self):
        loop_mails = []

        for mail in self.mails:
            if time.time() > self.mails[mail]:
                loop_mails.append(mail)

        return loop_mails


mails = Mails()


def ss(str, str2):
    substring = str[:min(255, len(str))]
    return substring + str2


def rnd_str(len: int):
    return ''.join(random.choices(string.ascii_letters, k=len))


def rnd_dig(len: int):
    return ''.join(random.choices(string.digits, k=len))


def promo_thread():
    try:
        while True:
            if not mails.get_loop_mails(
            ):  # if we dont have any mails incoming (otherwise the thread would take 100% of CPU)
                time.sleep(5)
                continue

            for email_id in mails.get_loop_mails():
                resp = requests.get(
                    f'https://api.kopeechka.store/mailbox-get-message?full=1&id={email_id}&token={kopeecha_key}')
                if resp.json()['value'] == "WAIT_LINK":
                    mails.mail_not_received(email_id)
                else:
                    mails.mail_received(email_id)
                    if 'fullmessage' not in resp.json():
                        continue
                    full_msg: str = resp.json()['fullmessage']
                    promo = full_msg.split('>Discord Nitro Redeem Link :<a href="')[
                        1].split('"')[0]
                    Console.success(f'Generated promo: {promo}')
                    thread_lock.acquire()
                    with open('promos.txt', 'a') as file:
                        file.write(promo + '\n')

                    global generated_promo
                    generated_promo += 1
                    thread_lock.release()
    except BaseException:
        traceback.print_exc()


def set_title():
    start = timer()
    while True:
        thread_lock.acquire()
        end = timer()
        elapsed_time = timedelta(seconds=end - start)
        os.system(
            f"title Promo Gen│ Promo Sent : {str(promo_sent)} │ Promo Received: {str(generated_promo)} │ Elapsed: {elapsed_time}"
        )
        thread_lock.release()
        time.sleep(1)


class Console():
    def success(message):
        thread_lock.acquire()
        print(
            f"{Fore.LIGHTBLACK_EX}[{datetime.datetime.now().strftime('%H:%M:%S')}] {Fore.LIGHTGREEN_EX}{message}{Fore.RESET}")
        thread_lock.release()

    def error(message):
        thread_lock.acquire()
        print(
            f"{Fore.LIGHTBLACK_EX}[{datetime.datetime.now().strftime('%H:%M:%S')}] {Fore.LIGHTRED_EX}{message}{Fore.RESET}")
        thread_lock.release()

    def info(message):
        thread_lock.acquire()
        print(
            f"{Fore.LIGHTBLACK_EX}[{datetime.datetime.now().strftime('%H:%M:%S')}] {Fore.LIGHTBLUE_EX}{message}{Fore.RESET}")
        thread_lock.release()

    def warning(message):
        thread_lock.acquire()
        print(
            f"{Fore.LIGHTBLACK_EX}[{datetime.datetime.now().strftime('%H:%M:%S')}] {Fore.LIGHTYELLOW_EX}{message}{Fore.RESET}")
        thread_lock.release()


def get_ghp_mail():
    return ''.join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=8)) + '@' + ''.join(
        random.choices(
            string.ascii_uppercase + string.digits,
            k=8)) + '.grupahakerskapiotr.us'


def make_mail_session():
    session = requests.session()
    if not proxies == "":
        session.proxies = {'https': f'http://{proxies}'}
    session.headers = {
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7',
        'connection': 'keep-alive',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'origin': 'https://www.webtoons.com',
        'sec-ch-ua': '"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"',
        'sec-ch-ua-full-version-list': '"Google Chrome";v="113.0.5672.93", "Chromium";v="113.0.5672.93", "Not-A.Brand";v="24.0.0.0"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-model': '""',
        'sec-ch-ua-platform': '"Windows"',
        'sec-ch-ua-platform-version': '"10.0.0"',
        'sec-fetch-dest': 'document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'cross-site',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    }
    return session

def make_promo_session():
    session = requests.session()
    if not proxies == "":
        session.proxies = {'https': f'http://{proxies}'}
    
    return session
mails_ = {}
wtu = '969a27255462a01df910a4ebedb3933e'


def make_promo():
    global promo_sent
    session = make_promo_session()

    start = time.time()
    nickname = rnd_str(8)
    email: str = get_ghp_mail()
    passwd = rnd_str(5) + rnd_dig(4)
    mails_[email] = {
        "start": start,
        "passwd": passwd
    }
    resp = session.get('https://www.webtoons.com/member/login/rsa/getKeys').json()
    encnm = resp['keyName']
    while True:
        try:
            encpw = requests.post(
                'http://127.0.0.1:2137/calc',
                json={
                    **resp,
                    "user": email,
                    "pass": passwd}).text
            break
        except BaseException:
            continue

    register_url = 'https://apis.webtoons.com/lineWebtoon/webtoon/joinById.json?serviceZone=GLOBAL&v=1&language=en&locale=en&platform=APP_ANDROID'
    timer = int(time.time() * 1000)
    spec = bytes("gUtPzJFZch4ZyAGviiyH94P99lQ3pFdRTwpJWDlSGFfwgpr6ses5ALOxWHOIT7R1", 'utf-8')
    mac_instance = hmac.new(spec, msg=ss(str(register_url), str(timer)).encode('utf-8'), digestmod=hashlib.sha1)
    encode_string = base64.b64encode(mac_instance.digest())

    register_data = {
    'loginType' : 'EMAIL',
    'encnm' : encnm,
    'encpw' : encpw,
    'nickname' : nickname,
    'emailEventAlarm' : 'false',
    'countryCode' : 'IN'
}
    register_resp = session.post(register_url,data=register_data,params={'md': encode_string,'msgpad':timer},headers={
    'accept-encoding' : 'gzip',
    'connection' : 'Keep-Alive',
    'content-type' : 'application/x-www-form-urlencoded',
    'cookie' : f'wtu={wtu}; locale=en; needGDPR=false; needCCPA=false; needCOPPA=false; countryCode=IN; _gid=GA1.2.2023107517.1684402567; _ga_ZTE4EZ7DVX=GS1.1.1684402567.1.0.1684402567.60.0.0; _ga=GA1.1.509665517.1684402567; contentLanguage=en; inAppNeedGDPR=false; inAppNeedCCPA=false; inAppNeedCOPPA=false; wtv=2; wts={time.time()*1000}',
    'user-agent' : 'nApps (Android 9; SM-G988N; linewebtoon; 2.12.5)',
    'wtu' : wtu
})
    if not register_resp.ok:
        Console.error('Failed to make webtoon account!')
        return
    if 'TOO_MANY_REQUEST' in register_resp.text:
        Console.error('Rate limited while creating account!')
        return
    if 'true' not in register_resp.text:
        Console.error(register_resp.text)
        return


def continue_making_promo(email_verify_link, email, passwd, start):
    global promo_sent
    session = make_promo_session()
    while True:
        try:
            legit_session = make_mail_session()
            legit_session.get(email_verify_link)
            break
        except BaseException:
            continue
    resp = session.get('https://www.webtoons.com/member/login/rsa/getKeys').json()
    encnm = resp['keyName']
    encpw = requests.post(
        'http://127.0.0.1:2137/calc',
        json={
            **resp,
            "user": email,
            "pass": passwd}).text
    login_url = 'https://apis.webtoons.com/lineWebtoon/webtoon/loginById.json'
    login_data = {
    'encnm' : encnm,
    'encpw' : encpw,
    'language' : 'en',
    'loginType' : 'EMAIL',
    'serviceZone' : 'GLOBAL',
    'v' : '2'
}
    login_headers = {
    'accept-encoding' : 'gzip',
    'connection' : 'Keep-Alive',
    'content-type' : 'application/x-www-form-urlencoded',
    'User-Agent' : "Android/9 Model/SM-G988N com.naver.linewebtoon/2.12.5(2120500,uid:10073) NeoIdSignInMod/0.1.12"
}
    login_resp = session.post(login_url,data=login_data,headers=login_headers)
    neo_ses = login_resp.json()["message"]["result"]["ses"]

    url = 'https://global.apis.naver.com/lineWebtoon/webtoon/setDeviceInfo.json?deviceKey=sex&appType=GLOBAL&pushToken=sex&pushCode=GCM&serviceZone=GLOBAL&v=1&language=en&locale=en&platform=APP_ANDROID'
    
    timer = int(time.time() * 1000)
    spec = bytes("gUtPzJFZch4ZyAGviiyH94P99lQ3pFdRTwpJWDlSGFfwgpr6ses5ALOxWHOIT7R1", 'utf-8')
    mac_instance = hmac.new(spec, msg=ss(str(url), str(timer)).encode('utf-8'), digestmod=hashlib.sha1)
    encode_string = base64.b64encode(mac_instance.digest())

    while True:
        try:
            resp = session.get(url, params={
                'msgpad': timer,
                'md': encode_string
            })
            print(resp.text)
            break
        except BaseException:
            continue

    url = 'https://global.apis.naver.com/lineWebtoon/webtoon/setDeviceInfo.json?deviceKey=sex&appType=LINEWEBTOON&pushToken=sex&pushCode=GCM&serviceZone=GLOBAL&v=1&language=en&locale=en&platform=APP_ANDROID'
    
    timer = int(time.time() * 1000)
    spec = bytes("gUtPzJFZch4ZyAGviiyH94P99lQ3pFdRTwpJWDlSGFfwgpr6ses5ALOxWHOIT7R1", 'utf-8')
    mac_instance = hmac.new(spec, msg=ss(str(url), str(timer)).encode('utf-8'), digestmod=hashlib.sha1)
    encode_string = base64.b64encode(mac_instance.digest())

    while True:
        try:
            resp = session.get(url, params={
                'msgpad': timer,
                'md': encode_string
            })
            print(resp.text)
            break
        except BaseException:
            continue


    for ir in range(1, 5):
        

        while True:
            try:
                resp = session.get(url, params={
                    'msgpad': timer,
                    'md': encode_string
                })
                print(resp.text)
                break
            except BaseException:
                continue

        
        
    Console.info(f'{email}:{passwd}')
    while True:
        BuyMail = requests.get(
            f'https://api.kopeechka.store/mailbox-get-email?api=2.0&site=webtoon.com&sender=webtoon&regex=&mail_type={mail_type}&token={kopeecha_key}')
        if 'id' not in BuyMail.json():
            Console.error(
                "Something went wrong when buying email: " +
                BuyMail.text)
            return
        emailId = BuyMail.json()['id']
        toSendMail = BuyMail.json()['mail']
        try:
            req = session.get(
                'https://m.webtoons.com/app/promotion/saveCompleteInfo',
                params={
                    'promotionName': 'en_discord_phase1_202305',
                    'memo': toSendMail},
                headers={
                    'Accept': 'application/json, text/plain, */*',
                    'accept-encoding': 'gzip, deflate',
                    'accept-language': 'en-US,en;q=0.9,pl-PL;q=0.8,pl;q=0.7',
                    'connection': 'keep-alive',
                    'referer': 'https://m.webtoons.com/app/promotion/read/en_discord_phase1_202305/progress?platform=APP_ANDROID',
                    'X-Requested-With': 'com.naver.linewebtoon',
                    'User-Agent' : 'Mozilla/5.0 (Linux; Android 9; 2107113SI Build/SKQ1.211006.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/103.0.5060.129 Safari/537.36 linewebtoon/2.12.5 (GLOBAL; EAF)'
                })
            break
        except BaseException:
            continue
    if 'true' in req.text:
        mails.add_mail(emailId)
        Console.info(f'Sent promo {toSendMail} in {time.time()-start}s')
        promo_sent += 1
    else:
        Console.error('Failed to get promo!')


async def mail_thread(pool):
    Console.info('Mail thread launched!')
    async with websockets.connect("ws://185.16.38.176:5678") as websocket:
        while True:
            message = json.loads(await websocket.recv())
            for content in message['content']:
                split = content.split('emailVerification?authNo=')
                if len(split) > 1:
                    email_verify_link = 'https://www.webtoons.com/en/member/set/emailVerification?authNo=' + \
                        split[1].split('"')[0]
                    recipient = message["rcpt_tos"]
                    if recipient not in mails_:
                        continue
                    account_info = mails_[recipient]

                    try:
                        threading.Thread(target=continue_making_promo, args=(
                            email_verify_link,
                            recipient,
                            account_info["passwd"],
                            account_info["start"],
                        )
                        ).start()
                    except BaseException:
                        traceback.print_exc()


def promo_maker_thread():
    # while True:
        try:
            make_promo()
        except BaseException:
            traceback.print_exc()


if __name__ == "__main__":
    init()
    thread_amt = config['threads']

    threading.Thread(target=set_title).start()
    threading.Thread(target=promo_thread).start()

    with ThreadPoolExecutor() as ex:
        for x in range(thread_amt):
            ex.submit(promo_maker_thread)
        asyncio.run(mail_thread(ex))
