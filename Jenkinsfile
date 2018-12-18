pipeline {
    agent none
    stages {
	stage('Unit tests') {
	    agent {
		dockerfile {
		    filename 'docker/Dockerfile.test'
		}
	    }
	    steps {
		sh 'npm test'
	    }
	}

	stage('Selenium tests') {
	    agent {
		dockerfile {
		    filename 'docker/Dockerfile.test'
		}
	    }
	    steps {
		browserstack(credentialsId: "0d9ec6a3-a3cf-4326-87db-ed9f8be49e82")
		sh 'npm run start:test &'
		sh 'pipenv run python __tests__/integrationTests.py --browserstack true'
	    }
	}
    }
}
