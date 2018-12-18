pipeline {
    agent {
	dockerfile {
	    filename 'docker/Dockerfile.test'
	}
    }
    stages {
	stage('Unit tests') {
	    steps {
		sh 'CI=true npm test'
	    }
	}

	stage('Selenium tests') {
	    steps {
		browserstack(credentialsId: "0d9ec6a3-a3cf-4326-87db-ed9f8be49e82")
		sh 'npm run start:test &'
		sh 'pipenv run python __tests__/integrationTests.py --browserstack true'
	    }
	}
    }
}
