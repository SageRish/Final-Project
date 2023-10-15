from googletrans import Translator
import smtplib
from kafka import KafkaConsumer

topic1 = 'message-topic1'

consumer1 = KafkaConsumer(topic1, bootstrap_servers=['localhost:9092'], group_id='group1', api_version=(0, 10, 1))

translator = Translator()

def send_email(email_id, subject, body, to_lang):
    # Translate the subject and body
    translated_subject = translator.translate(subject, src='en', dest=to_lang).text
    translated_body = translator.translate(body, src='en', dest=to_lang).text

    gmail_account = 's222458666@gmail.com'
    password = 'zqaw hxdb wufw dfuf'
    # Create a SMTP object
    smtpObj = smtplib.SMTP('smtp.gmail.com', 587)

    # Start TLS
    smtpObj.starttls()

    # Login to the account
    smtpObj.login(gmail_account, password)

    # Create a message
    message = 'Subject: {}\n\n{}'.format(translated_subject, translated_body)

    # Encode the message to UTF-8 format
    message = message.encode('utf-8')

    # Send the message
    smtpObj.sendmail(gmail_account, email_id, message)

    # Close the connection
    smtpObj.quit()

for msg in consumer1:
    data = msg.value.decode('utf-8').split('|')
    email_id = data[0]
    subject = data[1]
    body = data[2]
    to_lang = data[3]
    print(email_id, subject, body, to_lang)
    send_email(email_id, subject, body, to_lang)