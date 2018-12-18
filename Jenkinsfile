pipeline {
    agent any
    stages {
	stage('Unit tests') {
	    steps {
		sh 'docker build --force-rm --no-cache -t nspain/cub-attendance-testing -f docker/Dockerfile.test .'
		sh 'docker run -it nspain/cub-attendance-testing "CI=true npm test"'
	    }
	}

	stage('Selenium tests') {
	    steps {
		browserstack(credentialsId: "0d9ec6a3-a3cf-4326-87db-ed9f8be49e82")
		sh 'docker build --force-rm --no-cache -t nspain/cub-attendance-testing -f docker/Dockerfile.test .'
		sh 'docker run -it nspain/cub-attendance-testing "./__tests__/run_tests.sh integration"'
	    }
	}
    }
}
