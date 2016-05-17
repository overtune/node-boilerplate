# -*- mode: ruby -*-
# vi: set ft=ruby :

INSTALL_RUBY = true
INSTALL_CAPISTRANO = true

Vagrant.configure(2) do |config|

	config.vm.box = "ubuntu/trusty64"
	config.vm.network "private_network", ip: "192.168.33.01"


	config.vm.provider "virtualbox" do |vb|
		vb.cpus = "2"
		vb.memory = "1024"
	end



	config.vm.provision "shell", inline: <<-SHELL

		#------------------------- GENERAL ----------------------------------------------------
		sudo apt-get update
		apt-get install -y build-essential python wget zlib1g-dev libssl-dev libreadline6-dev libyaml-dev


		#------------------------- Ruby -------------------------------------------------------
		if INSTALL_RUBY == true
			cd /tmp
			wget http://ftp.ruby-lang.org/pub/ruby/2.1/ruby-2.1.5.tar.gz 
			tar -xvzf ruby-2.1.5.tar.gz
			cd ruby-2.1.5/
			./configure --prefix=/usr/local
			make
			sudo make install
		end


		#------------------------- Capistrano -------------------------------------------------
		if INSTALL_CAPISTRANO == true
			sudo gem install capistrano

			# capistrano/copy
			sudo gem install capistrano-scm-copy
		end


		#------------------------- NodeJS -----------------------------------------------------
		#https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories
		curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
		sudo apt-get install -y nodejs


		#------------------------- NGINX ------------------------------------------------------
		sudo apt-get install -y nginx
		mv /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
		cp /vagrant/nginx-dev.conf /etc/nginx/nginx.conf


		#------------------------- PM2 --------------------------------------------------------
		sudo npm install -g pm2

	SHELL



	config.vm.provision "shell", run:"always", privileged:false, inline: <<-SHELL
		sudo cp /vagrant/nginx-dev.conf /etc/nginx/nginx.conf
		sudo service nginx restart
		cd /vagrant/server
		pm2 start pm2_development.json
	SHELL

end