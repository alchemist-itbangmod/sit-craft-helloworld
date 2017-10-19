pipeline {
  environment {
    DEV_USERNAME = "deployment"
    DEV_HOSTNAME = "helloworld.itbangmod.in.th"
    DEV_REMOTE_ARTIFACT_PATH = "/jenkins-artifact/sit-craft-helloworld/"
    DEV_REMOTE_DEPLOY_PATH = "/jenkins-app/sit-craft-helloworld/"
    DEV_REMOTE_PM2_PROCESS_NAME = "sit-craft-helloworld-site"
    DEV_CONFIRM_ID = "deploy-dev"
    ARCHIVE_ARTIFACT_PATH = "/jenkins-artifact/sit-craft-helloworld"
  }
  agent any
  stages {
    stage('build') {
      steps {
        slackSend color: '#439FE0', message: "[${JOB_NAME}] เริ่มต้นการ Build #${BUILD_NUMBER}"
        sh 'yarn install'
        sh 'yarn build'
      }
    }
    stage('unit-test') {
      steps {
        sh 'jest --ci --testResultsProcessor="jest-junit"'
        slackSend color: 'good', message: "[${JOB_NAME}] Test Build ที่ #${BUILD_NUMBER}) ผ่านแล้ว XD"
      }
    }
    stage('zipfile') {
      steps {
        sh 'tar czf "${ARCHIVE_ARTIFACT_PATH}/${JOB_NAME}-${BUILD_NUMBER}.tar.gz" .'
      }
    }
    stage('development') {
      steps {
        sh 'scp "${ARCHIVE_ARTIFACT_PATH}/${JOB_NAME}-${BUILD_NUMBER}.tar.gz" ${DEV_USERNAME}@${DEV_HOSTNAME}:${DEV_REMOTE_ARTIFACT_PATH}'
        sh 'ssh ${DEV_USERNAME}@${DEV_HOSTNAME} "tar -xf ${DEV_REMOTE_ARTIFACT_PATH}/"${JOB_NAME}-${BUILD_NUMBER}.tar.gz" -C ${DEV_REMOTE_DEPLOY_PATH}"'
        // sh 'ssh ${DEV_USERNAME}@${DEV_HOSTNAME} "cd ${DEV_REMOTE_DEPLOY_PATH} && sudo yarn build"'
        sh 'ssh ${DEV_USERNAME}@${DEV_HOSTNAME} "sudo pm2 restart ${DEV_REMOTE_PM2_PROCESS_NAME}"'
        slackSend color: 'good', message: "[${JOB_NAME}] ได้ทำการติดตั้ง Build ที่ #${BUILD_NUMBER} ลงบน Development Server แล้ว"
      }
    }
    stage('staging') {
      steps {
        slackSend color: '#ffab35', message: "[${JOB_NAME}] ต้องการ Deploy Build ที่ #${BUILD_NUMBER}) ลงบน Staging ? : <${BUILD_URL}/input|Click to proceed>"    
        timeout(time: 7, unit: 'DAYS') {
          input message: 'Deploy to Staging ?', ok: 'Deploy to Staging'
        }
        sh 'echo "Deploy To Stagging"'
        slackSend color: 'good', message: "[${JOB_NAME}] ได้ทำการติดตั้ง Build ที่ #${BUILD_NUMBER} ลงบน Staging Server แล้ว"
      }
    }
    stage('production') {
      steps {
        slackSend color: '#ffab35', message: "[${JOB_NAME}] ต้องการ Deploy Build ที่ #${BUILD_NUMBER}) ลงบน Production ? : <${BUILD_URL}/input|Click to proceed>"
        timeout(time: 7, unit: 'DAYS') {
          input message: 'Deploy to Production ?', ok: 'Deploy to Production'
        }
        sh 'echo "Deploy To Production"'
        slackSend color: 'good', message: "[${JOB_NAME}] ได้ทำการติดตั้ง Build ที่ #${BUILD_NUMBER} ลงบน Production Server แล้ว วู้หู้วววววว"
      }
    }
  }
  post {
    always {
      junit "junit.xml"
    }
    success {
      slackSend color: 'good', message: "[${JOB_NAME}] Build ที่ #${BUILD_NUMBER} Pipeline เสร็จสิ้นแล้ว"
    }
    failure {
      slackSend color: 'danger', message: "[${JOB_NAME}] แย่แล้ว มีบางอย่างผิดปกติ (Build ที่ #${BUILD_NUMBER})"
    }
    unstable {
      slackSend color: '#ffab35', message: "[${JOB_NAME}] มันไม่เสถียรนะ (Build ที่ #${BUILD_NUMBER})"
    }
    changed {
      echo 'This will run only if the state of the Pipeline has changed'
      echo 'For example, if the Pipeline was previously failing but is now successful'
    }
    aborted {
      slackSend color: '#439FE0', message: "[${JOB_NAME}] Build ที่ #${BUILD_NUMBER} ถูกยกเลิก Pipeline"
    }
  }
}