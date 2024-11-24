import os
import re
import json
import yaml
import hashlib
from datetime import datetime

CUSTOM_DIR_PATH = 'custom'
DATA_DIR_PATH = 'data'

def process(customDirPath, dataDirPath):
    print('--article--')

    configFile = open(os.path.join(customDirPath, 'config.yml'), 'r', encoding='utf-8')
    configContent = configFile.read()
    configFile.close()
    configContent = yaml.safe_load(configContent)
    timeFormat = configContent.get('timeFormat', f'%Y/%m/%d')

    articleDirPath = os.path.join(customDirPath, 'article')

    outputData = processArticle(articleDirPath, timeFormat)

    outputContent = json.dumps(outputData)
    outputContent = outputContent.replace('<?=customDirPath?>', customDirPath)
    with open(os.path.join(dataDirPath, 'article.json'), 'w+', encoding='utf-8') as outputFile:
        json.dump(outputData, outputFile, ensure_ascii=False, indent=4)

    md5 = hashlib.md5()
    md5.update(outputContent.encode('utf-8'))
    md5Value = md5.hexdigest()
    md5Content = {}
    try:
        md5File = open(os.path.join(dataDirPath, 'md5.json'), 'r', encoding='utf-8')
        md5Content = md5File.read()
        md5File.close()
        md5Content = json.loads(md5Content)
    except: pass
    md5Content['article'] = md5Value
    md5Content = json.dumps(md5Content)
    md5File = open(os.path.join(dataDirPath, 'md5.json'), 'w+', encoding='utf-8')
    md5File.write(md5Content)
    md5File.close()

def processArticle(articleDirPath, timeFormat):
    archives = {}
    categories = {}
    tags = {}
    articleDatas = []
    articles = [articlePath for articlePath in os.listdir(articleDirPath) if articlePath.endswith('.md')]
    
    for root, dirs, files in os.walk(articleDirPath):
        for folder in dirs:
            articleFolderPath = os.path.join(articleDirPath, folder)
            articles += [os.path.join(folder, articlePath) for articlePath in os.listdir(articleFolderPath) if articlePath.endswith('.md')]

    for articleName in articles:
        articlePath = os.path.join(articleDirPath, articleName)
        articleFile = open(articlePath, 'r', encoding='utf-8')
        articleContent = articleFile.read()
        articleFile.close()
        articleData = {}
        articleDatas.append(articleData)
        for line in articleContent.split('\n'):
            if line.startswith('<!--'):
                noteType = re.sub(r'<!-- *', '', line).split(':')[0]
                if noteType in ['title', 'description', 'subtitle', 'category', 'tags', 'publishedTime', 'published time', 'cover', 'cover image', 'cover path']:
                    noteContent = re.sub(f'<!-- *{noteType}: *(.*)', r'\1', line)
                    noteContent = list(noteContent)
                    noteContent.reverse()
                    noteContent = ''.join(noteContent)
                    noteContent = re.sub(f'>-- *(.*)', r'\1', noteContent)
                    noteContent = list(noteContent)
                    noteContent.reverse()
                    noteContent = ''.join(noteContent)
                    if noteType == 'subtitle': noteType = 'description'
                    if noteType == 'published time': noteType = 'publishedTime'
                    if noteType == 'cover image': noteType = 'cover'
                    if noteType == 'cover path': noteType = 'cover'

                    articleData[noteType] = noteContent
                    if noteType == 'category':
                        if not categories.get(noteContent): categories[noteContent] = []
                        # categories[noteContent].append(articlePath)
                    elif noteType == 'tags':
                        noteContent = noteContent.replace(' ', '')
                        noteContent = noteContent.split(',')
                        articleData[noteType] = noteContent
                        for tagName in noteContent:
                            if not tags.get(tagName): tags[tagName] = []
                            # tags[tagName].append(articlePath)
        articleData['name'] = '.'.join(articleName.split('.')[0:-1])
        print(articleData['name'])
        articleData['path'] = articlePath
        articleData['title'] = articleData['title'] if 'title' in articleData else 'Untitled'
        articleData['publishedTime'] = articleData['publishedTime'] if 'publishedTime' in articleData else datetime.today().strftime(timeFormat)
        readingTime = len(re.sub(r'[^0-9a-zA-Z][0-9a-zA-Z]+[^0-9a-zA-Z]', '字', articleContent))/500
        articleData['readingTime'] = f'{int(readingTime)} minute'
        articleData['archive'] = noteContent = datetime.strptime(articleData['publishedTime'], timeFormat).strftime('%Y')
        if not archives.get(articleData['archive']): archives[articleData['archive']] = []
        # archives[articleData['archive']].append(articlePath)

    articleDatas = sorted(articleDatas, key=(lambda articleData: datetime.strptime(articleData['publishedTime'], timeFormat)), reverse=False)

    outputData = {
        'archives': archives, 
        'categories': categories, 
        'tags': tags, 
        'articleDatas': articleDatas
    }

    return outputData

if __name__ == '__main__':
    if len(os.sys.argv) > 1:
        process(os.sys.argv[1], DATA_DIR_PATH)
    else:
        process(CUSTOM_DIR_PATH, DATA_DIR_PATH)