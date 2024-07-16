import os
import html, article, portfolio, rss, siteCover

VERSION = 'v1.0.1'
DESCRIPTION = '''
--h, -help
--v, -version
-custom <custom directory path>
-update <update type (all / config / article / portfolio)>
'''
CUSTOM_DIR_PATH = 'custom_frc8725'
DATA_DIR_PATH = 'data'

def process(customDirPath, dataDirPath, updateValueList):
    moduleList = [article, portfolio, html, rss, siteCover]
    if 'all' in updateValueList:
        for module in moduleList:
            getattr(module, 'process')(customDirPath, dataDirPath)
    else:
        processModule = {hash(module):False for module in moduleList}
        if 'config' in updateValueList:
            for module in [html, rss, siteCover]: processModule[hash(module)] = True
        if 'article' in updateValueList:
            for module in [article, rss]: processModule[hash(module)] = True
        if 'portfolio' in updateValueList:
            for module in [portfolio]: processModule[hash(module)] = True
        for module in moduleList:
            if processModule[hash(module)]:
                getattr(module, 'process')(customDirPath, dataDirPath)

if __name__ == '__main__':
    argTable = {
        '--v': 'version', '-version': 'version', 
        '--h': 'help', '-help': 'help', 
        '-custom': 'custom', 
        '-update': 'update'
    }
    argData = {'default': []}
    lastList = argData['default']
    for arg in os.sys.argv[1:]:
        if arg in argTable:
            valueList = []
            argData[argTable[arg]] = valueList
            lastList = valueList
        else:
            lastList.append(arg)

    if argData.get('help', None) != None: print(DESCRIPTION)
    if argData.get('version', None) != None: print(VERSION)
    
    customDirPath = CUSTOM_DIR_PATH
    customValueList = argData.get('custom', None)
    if customValueList != None and len(customValueList) > 0:
        customDirPath = customValueList[0] 
    
    updateValueList = argData.get('update', None)
    if updateValueList != None and len(updateValueList) > 0:
        process(customDirPath, DATA_DIR_PATH, updateValueList)