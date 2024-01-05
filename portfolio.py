import os
import yaml
import json
import hashlib

CUSTOM_DIR_PATH = 'custom'
DATA_DIR_PATH = 'data'

def process(customDirPath, dataDirPath):
    print('--portfolio--')
    portfolioFile = open(os.path.join(customDirPath, 'portfolio.yml'), 'r', encoding='utf-8')
    portfolioContent = portfolioFile.read()
    portfolioFile.close()
    portfolioContent = yaml.safe_load(portfolioContent)

    outputData = {
        'works': portfolioContent['works'] if 'works' in portfolioContent else None, 
        'videos': portfolioContent['videos'] if 'videos' in portfolioContent else None
    }
    outputContent = json.dumps(outputData)
    outputContent = outputContent.replace('<?=customDirPath?>', customDirPath)
    outputFile = open(os.path.join(dataDirPath, 'portfolio.json'), 'w+', encoding='utf-8')
    outputFile.write(outputContent)
    outputFile.close()

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
    md5Content['portfolio'] = md5Value
    md5Content = json.dumps(md5Content)
    md5File = open(os.path.join(dataDirPath, 'md5.json'), 'w+', encoding='utf-8')
    md5File.write(md5Content)
    md5File.close()

if __name__ == '__main__':
    if len(os.sys.argv) > 1:
        process(os.sys.argv[1], DATA_DIR_PATH)
    else:
        process(CUSTOM_DIR_PATH, DATA_DIR_PATH)