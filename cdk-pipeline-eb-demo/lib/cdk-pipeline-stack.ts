import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import {  Stack, StackProps } from 'aws-cdk-lib';
import { CdkEBStage } from './eb-stage';

/**
 * The stack that defines the application pipeline
 */
export class CdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',

       // How it will be built and synthesized
       synth: new ShellStep('Synth', {
         // Where the source can be found
         input: CodePipelineSource.gitHub('eseantatum/cdk_eb', 'master'),
         
         // Install dependencies, build and run cdk synth
         //installCommands: ['npm i -g npm@latest'],
         commands: [
          'cd cdk-pipeline-eb-demo/src', 
          'docker build -t helloworld . && docker run -p 8080:3000 -it -t helloworld'
         ],
       }),
    });

    // This is where we add the application stages fs
        // This is where we add the application stages

    // deploy beanstalk app
    // For environment with all default values:
    // const deploy = new CdkEBStage(this, 'Pre-Prod');

    // For environment with custom AutoScaling group configuration
    const deploy = new CdkEBStage(this, 'Pre-Prod', { 
      minSize : "1",
      maxSize : "2"
    });
    const deployStage = pipeline.addStage(deploy); 

  }
}

