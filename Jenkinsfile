pipeline {
  environment {
    DEV_USERNAME = "deployment"
    DEV_HOSTNAME = "helloworld.itbangmod.in.th"
    DEV_REMOTE_ARTIFACT_PATH = "/jenkins-artifact/sit-craft-helloworld/"
    DEV_REMOTE_DEPLOY_PATH = "/jenkins-app/sit-craft-helloworld/"
    DEV_REMOTE_PM2_PROCESS_NAME = "sit-craft-helloworld-site"
    ARCHIVE_ARTIFACT_PATH = "/jenkins-artifact/sit-craft-helloworld"
  }
  agent any
  stages {
    stage('build') {
      steps {
        slackSend channel: '#devops', color: '#439FE0', message: "[${JOB_NAME}] เริ่มต้นการ Build #${BUILD_NUMBER}", teamDomain: 'alchemist-itbangmod'
        sh 'yarn install'
        sh 'yarn run build'
      }
    }
    stage('unit-test') {
      steps {
        sh 'jest --ci --testResultsProcessor="jest-junit"'
      }
    }
    stage('zipfile') {
      steps {
        sh 'tar cvzf "${ARCHIVE_ARTIFACT_PATH}/${JOB_NAME}-${BUILD_NUMBER}.tar.gz" *'
      }
    }
    stage('development') {
      steps {
        sh 'scp "${ARCHIVE_ARTIFACT_PATH}/${JOB_NAME}-${BUILD_NUMBER}.tar.gz" ${DEV_USERNAME}@${DEV_HOSTNAME}:${DEV_REMOTE_ARTIFACT_PATH}'
        sh 'ssh ${DEV_USERNAME}@${DEV_HOSTNAME} "tar -xf ${DEV_REMOTE_ARTIFACT_PATH}/"${JOB_NAME}-${BUILD_NUMBER}.tar.gz" -C ${DEV_REMOTE_DEPLOY_PATH}"'
        sh 'ssh ${DEV_USERNAME}@${DEV_HOSTNAME} "sudo pm2 restart ${DEV_REMOTE_PM2_PROCESS_NAME}"'
        slackSend channel: '#devops', color: 'good', message: "[${JOB_NAME}] ได้ทำการติดตั้ง Build ที่ #${BUILD_NUMBER} ลงบน Development Server แล้ว", teamDomain: 'alchemist-itbangmod'
      }
    }
    stage('staging') {
      steps {
        timeout(time: 7, unit: 'DAYS') {
          input 'Deploy to Staging ?'
        }
        sh 'echo "Deploy To Stagging"'
        slackSend channel: '#devops', color: 'good', message: "[${JOB_NAME}] ได้ทำการติดตั้ง Build ที่ #${BUILD_NUMBER} ลงบน Staging Server แล้ว", teamDomain: 'alchemist-itbangmod'        
      }
    }
    stage('production') {
      steps {
        timeout(time: 7, unit: 'DAYS') {
          input 'Deploy to Production ?'
        }
        sh 'echo "Deploy To Production"'
        slackSend channel: '#devops', color: 'good', message: "[${JOB_NAME}] ได้ทำการติดตั้ง Build ที่ #${BUILD_NUMBER} ลงบน Production Server แล้ว วู้หู้วววววว", teamDomain: 'alchemist-itbangmod'        
      }
    }
  }
  post {
    always {
      junit "junit.xml"
    }
    success {
      slackSend channel: '#devops', color: 'good', message: "[${JOB_NAME}] Build ที่ #${BUILD_NUMBER} Pipeline เสร็จสิ้นแล้ว", teamDomain: 'alchemist-itbangmod'
    }
    failure {
      slackSend channel: '#devops', color: 'danger', message: "[${JOB_NAME}] แย่แล้ว มีบางอย่างผิดปกติ (Build ที่ #${BUILD_NUMBER})", teamDomain: 'alchemist-itbangmod'
    }
    unstable {
      slackSend channel: '#devops', color: '#ffab35', message: "[${JOB_NAME}] มันไม่เสถียรนะ (Build ที่ #${BUILD_NUMBER})", teamDomain: 'alchemist-itbangmod'
    }
    changed {
      echo 'This will run only if the state of the Pipeline has changed'
      echo 'For example, if the Pipeline was previously failing but is now successful'
    }
    aborted {
      slackSend channel: '#devops', color: '#439FE0', message: "[${JOB_NAME}] Build ที่ #${BUILD_NUMBER} ถูกยกเลิก Pipeline", teamDomain: 'alchemist-itbangmod'
    }
  }
}