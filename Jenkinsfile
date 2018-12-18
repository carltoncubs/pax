pipeline {
    agent any
    stages {
	stage('Build docker image') {
	    steps {
		sh 'docker build --force-rm --no-cache -t nspain/cub-attendance-testing -f docker/Dockerfile.test .'
	    }
	}

	stage('Unit tests') {
	    steps {
		sh 'docker run -e CI=true -it nspain/cub-attendance-testing npm test'
	    }
	}

	stage('Selenium tests') {
	    steps {
		browserstack(credentialsId: "0d9ec6a3-a3cf-4326-87db-ed9f8be49e82")
		sh 'docker run -it nspain/cub-attendance-testing "./__tests__/run_tests.sh integration"'
	    }
	}
    }
}
