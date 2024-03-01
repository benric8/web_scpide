const fs = require('fs');
const createFolder = (dir) =>{
    try {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
            console.log('info: "'+ dir +'" creado')
        }
        else{
            console.log('warning: "'+ dir+ '" ya existe.')
        }
    } catch (error) {
        console.log(error);
    }
}

const createFolderArray = (array) =>{
    array.forEach((dir) => {
        createFolder(dir);
    });
}

const touchFile = (pathFile) =>{
    const time = new Date();
    try {
        fs.utimesSync(pathFile, time, time);
    } catch (e) {
        let fd = fs.openSync(pathFile, 'a');
        fs.closeSync(fd);
    }
}

const createStructureBasic = () =>{
    createFolderArray(
        [
            'src/app/domain/models',
            'src/app/domain/dto',
            'src/app/use-cases',
            'src/app/infrastructure/global-store',
            'src/app/infrastructure/security',
            'src/app/infrastructure/shared/pages',
            'src/app/infrastructure/shared/components',
            'src/app/infrastructure/services/local',
            'src/app/infrastructure/services/remote',
            'src/app/infrastructure/layouts',
            'src/app/infrastructure/modules/public/components',
            'src/app/infrastructure/modules/public/routers',
            'src/app/infrastructure/modules/public/store/actions',
            'src/app/infrastructure/modules/public/store/effects',
            'src/app/infrastructure/modules/public/store/reducers',
            'src/app/infrastructure/modules/public/store/states',
            'src/app/infrastructure/modules/public/store/entity',
        ]
    );
    touchFile('src/app/constants.ts');
    touchFile('src/app/global.scss');
}

const createStructureWithModules = (modules=[]) =>{
    createFolderArray(
        [
            'src/app/domain/models',
            'src/app/domain/dto',
            'src/app/use-cases',
            'src/app/infrastructure/global-store',
            'src/app/infrastructure/security',
            'src/app/infrastructure/shared/pages',
            'src/app/infrastructure/shared/components',
            'src/app/infrastructure/services/local',
            'src/app/infrastructure/services/remote',
            'src/app/infrastructure/layouts',
        ]
    );

    modules.forEach((mod) => {
        let val = mod.trim();
        createFolderArray(
            [
                'src/app/infrastructure/modules/'+val+'/components',
                'src/app/infrastructure/modules/'+val+'/routers',
                'src/app/infrastructure/modules/'+val+'/store/actions',
                'src/app/infrastructure/modules/'+val+'/store/effects',
                'src/app/infrastructure/modules/'+val+'/store/reducers',
                'src/app/infrastructure/modules/'+val+'/store/states',
                'src/app/infrastructure/modules/'+val+'/store/entity',
            ]
        );
    });

    /*for(let i=0;i<modules.length;i++){
    };*/
    touchFile('src/app/constants.ts');
    touchFile('src/app/global.scss');
}

//------------- inicializar proyecto ------------
// dir = './tmp/but/then/nested';
const processParams = (param) =>{
    /*
    --public                                   //-- genera una estructura con el modulo public, recomendado para aplicacionscon solo una pagina web
    --modulos=public,admin,servicedesk         //-- un modulo es una unidad funcional del sistema, podria considerarse como un entregable
    */
   const param_arr = param.split('=');
   const comand = param_arr[0].trim();
    switch (comand) {
        case '--public':
            createStructureBasic();
            break;
        case '--modulos':
            let modulos_arr = param_arr[1].trim().split(',');
            createStructureWithModules(modulos_arr);
            break;
        default:
            console.log("El parametro "+ comand +" no es valido");
            break;
    }
}

process.argv.forEach((val, index, array) =>{
    //console.log(index + ': ' + val);
    if(index>=2){
        processParams(val)
    }
});
