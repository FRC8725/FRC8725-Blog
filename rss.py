import os
import yaml
import json
import basic
from datetime import datetime

CUSTOM_DIR_PATH = 'custom'
DATA_DIR_PATH = 'data'

def process(customDirPath, dataDirPath):
    print('--rss--')
    rssContent = []

    templateFile = open(os.path.join(dataDirPath, 'rss'), 'r', encoding='utf-8')
    templateContent = templateFile.read()
    templateFile.close()
    templateContent = templateContent.replace('<?=customDirPath?>', customDirPath)

    configFile = open(os.path.join(customDirPath, 'config.yml'), 'r', encoding='utf-8')
    configContent = configFile.read()
    configFile.close()
    configContent = yaml.safe_load(configContent)
    
    articleFile = open(os.path.join(dataDirPath, 'article.json'), 'r', encoding='utf-8')
    articleContent = articleFile.read()
    articleFile.close()
    articleContent = json.loads(articleContent)

    timeFormat = configContent.get('timeFormat', f'%Y/%m/%d')
    # articleContent['articleDatas'] = sorted(articleContent['articleDatas'], key=(lambda articleData: datetime.strptime(articleData['publishedTime'], timeFormat)), reverse=False)
    for articleData in articleContent['articleDatas']:
        articleData['publishedTime'] = basic.RFC822(articleData['publishedTime'] if 'publishedTime' in articleData else False, timeFormat, configContent.get('timeZone', '+0000'))
    
    dataContent = {'config': configContent, 'article': articleContent['articleDatas'][-20:]}

    rssContent = basic.magicTagReplace(templateContent, dataContent, removeLineWhenMissingData=False)
        
    outputFile = open('rss', 'w+', encoding='utf-8')
    outputFile.write(rssContent)
    outputFile.close()

if __name__ == '__main__':
    if len(os.sys.argv) > 1:
        process(os.sys.argv[1], DATA_DIR_PATH)
    else:
        process(CUSTOM_DIR_PATH, DATA_DIR_PATH)